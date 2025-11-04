from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from app.sudoku.models import SudokuGame as SudokuGameModel
from app.users.models import User
from app.sudoku.core import (
    generate_puzzle,
    is_solved,
    make_move,
    get_hint,
    get_solution,
    get_candidates_all,
)
import json
from typing import List, Optional


class GameService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_game(
        self,
        board_state: str,
        player1_id: int,
        player2_id: int = None,
        difficulty: str = None,
        digit_types: Optional[List[str]] = None,
    ):
        # Check player1 exists
        result = await self.db.execute(select(User).where(User.id == player1_id))
        if not result.scalar_one_or_none():
            raise ValueError("Player1 not found")
        if player2_id:
            result2 = await self.db.execute(select(User).where(User.id == player2_id))
            if not result2.scalar_one_or_none():
                raise ValueError("Player2 not found")

        db_game = SudokuGameModel(
            board_state=board_state,
            digit_types=json.dumps(digit_types) if digit_types else None,
            player1_id=player1_id,
            player2_id=player2_id,
            difficulty=difficulty,
        )
        self.db.add(db_game)
        await self.db.commit()
        await self.db.refresh(db_game)
        return db_game

    async def get_game(self, game_id: int):
        result = await self.db.execute(
            select(SudokuGameModel).where(SudokuGameModel.id == game_id)
        )
        return result.scalar_one_or_none()

    async def get_games(self, player_id: int = None, skip: int = 0, limit: int = 100):
        query = select(SudokuGameModel)
        if player_id:
            query = query.where(
                or_(
                    SudokuGameModel.player1_id == player_id,
                    SudokuGameModel.player2_id == player_id,
                )
            )
        result = await self.db.execute(query.offset(skip).limit(limit))
        return result.scalars().all()

    async def update_game(self, game_id: int, update_data: dict):
        game = await self.get_game(game_id)
        if not game:
            return None
        for key, value in update_data.items():
            if hasattr(game, key):
                setattr(game, key, value)
        await self.db.commit()
        await self.db.refresh(game)
        return game

    async def delete_game(self, game_id: int):
        game = await self.get_game(game_id)
        if not game:
            return False
        await self.db.delete(game)
        await self.db.commit()
        return True

    async def create_singleplayer_game(
        self,
        user_id: int,
        difficulty: str = "medium",
        digit_types: Optional[List[str]] = None,
    ):
        # Get user or create dummy
        result = await self.db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if not user:
            dummy_user = User(
                username=f"user{user_id}",
                email=f"user{user_id}@example.com",
                hashed_password="dummy",
                is_active=True,
            )
            self.db.add(dummy_user)
            await self.db.commit()
            await self.db.refresh(dummy_user)
            user = dummy_user

        board_state = generate_puzzle(difficulty)

        db_game = SudokuGameModel(
            board_state=board_state,
            digit_types=json.dumps(digit_types) if digit_types else None,
            player1_id=user_id,
            difficulty=difficulty,
        )
        self.db.add(db_game)
        await self.db.commit()
        await self.db.refresh(db_game)
        return db_game

    async def make_move(
        self, game_id: int, player_id: int, row: int, col: int, value: int
    ):
        db_game = await self.get_game(game_id)
        if not db_game:
            raise ValueError("Game not found")

        # Check if player is part of this game
        if player_id not in (db_game.player1_id, db_game.player2_id):
            raise ValueError("Player not in this game")

        # Check if game is not completed
        if is_solved(db_game.board_state):
            raise ValueError("Game is already completed")

        new_state = make_move(db_game.board_state, row, col, value)
        if new_state is None:
            # Invalid move, record mistake
            if player_id == db_game.player1_id:
                db_game.mistakes_p1 += 1
            elif db_game.player2_id and player_id == db_game.player2_id:
                db_game.mistakes_p2 += 1
            raise ValueError("Invalid move")
        else:
            # Valid move, record
            if player_id == db_game.player1_id:
                db_game.valid_moves_p1 += 1
            elif db_game.player2_id and player_id == db_game.player2_id:
                db_game.valid_moves_p2 += 1
            db_game.board_state = new_state
            # Game ends if solved, but no status change, derive from board_state

        await self.db.commit()
        await self.db.refresh(db_game)
        return db_game

    async def get_hint(self, game_id: int):
        db_game = await self.get_game(game_id)
        if not db_game:
            raise ValueError("Game not found")

        hint = get_hint(db_game.board_state)
        if hint is None:
            raise ValueError("No hint available")

        return hint

    async def solve_game(self, game_id: int):
        db_game = await self.get_game(game_id)
        if not db_game:
            raise ValueError("Game not found")

        solution = get_solution(db_game.board_state)
        if solution is None:
            raise ValueError("Game is not solvable")

        return {"solution": solution}

    async def get_candidates(self, game_id: int):
        db_game = await self.get_game(game_id)
        if not db_game:
            raise ValueError("Game not found")
        return {"candidates": get_candidates_all(db_game.board_state)}
