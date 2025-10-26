from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from app.sudoku.models import SudokuBoard as SudokuBoardModel
from app.users.models import User
from app.sudoku.core import (
    generate_puzzle,
    is_solved,
    make_move,
    get_hint,
    get_solution,
    get_candidates_all,
)


class BoardService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_board(
        self, board_state: str, player1_id: int, player2_id: int, current_player_id: int
    ):
        # Check players exist
        users = await self.db.execute(
            select(User).where(User.id.in_([player1_id, player2_id]))
        )
        found_users = users.scalars().all()
        if len(found_users) != 2:
            raise ValueError("One or both players not found")

        db_board = SudokuBoardModel(
            board_state=board_state,
            player1_id=player1_id,
            player2_id=player2_id,
            current_player_id=current_player_id,
        )
        self.db.add(db_board)
        await self.db.commit()
        await self.db.refresh(db_board)
        return db_board

    async def get_board(self, board_id: int):
        result = await self.db.execute(
            select(SudokuBoardModel).where(SudokuBoardModel.id == board_id)
        )
        return result.scalar_one_or_none()

    async def get_boards(self, player_id: int = None, skip: int = 0, limit: int = 100):
        query = select(SudokuBoardModel)
        if player_id:
            query = query.where(
                or_(
                    SudokuBoardModel.player1_id == player_id,
                    SudokuBoardModel.player2_id == player_id,
                )
            )
        result = await self.db.execute(query.offset(skip).limit(limit))
        return result.scalars().all()

    async def update_board(self, board_id: int, update_data: dict):
        board = await self.get_board(board_id)
        if not board:
            return None
        for key, value in update_data.items():
            if hasattr(board, key):
                setattr(board, key, value)
        await self.db.commit()
        await self.db.refresh(board)
        return board

    async def delete_board(self, board_id: int):
        board = await self.get_board(board_id)
        if not board:
            return False
        await self.db.delete(board)
        await self.db.commit()
        return True

    async def create_singleplayer_board(self, user_id: int, difficulty: str = "medium"):
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

        # Create board with same player for singleplayer
        db_board = SudokuBoardModel(
            board_state=board_state,
            player1_id=user_id,
            player2_id=user_id,
            current_player_id=user_id,
            status="ongoing",
        )
        self.db.add(db_board)
        await self.db.commit()
        await self.db.refresh(db_board)
        return db_board

    async def make_move(self, board_id: int, row: int, col: int, value: int):
        db_board = await self.get_board(board_id)
        if not db_board:
            raise ValueError("Board not found")

        if db_board.status != "ongoing":
            raise ValueError("Game is not ongoing")

        new_state = make_move(db_board.board_state, row, col, value)
        if new_state is None:
            raise ValueError("Invalid move")

        db_board.board_state = new_state

        if is_solved(new_state):
            db_board.status = "completed"
            db_board.winner_id = db_board.current_player_id

        await self.db.commit()
        await self.db.refresh(db_board)
        return db_board

    async def get_hint(self, board_id: int):
        db_board = await self.get_board(board_id)
        if not db_board:
            raise ValueError("Board not found")

        hint = get_hint(db_board.board_state)
        if hint is None:
            raise ValueError("No hint available")

        return {"row": hint[0], "col": hint[1], "value": hint[2]}

    async def solve_board(self, board_id: int):
        db_board = await self.get_board(board_id)
        if not db_board:
            raise ValueError("Board not found")

        solution = get_solution(db_board.board_state)
        if solution is None:
            raise ValueError("Board is not solvable")

        return {"solution": solution}

    async def get_candidates(self, board_id: int):
        db_board = await self.get_board(board_id)
        if not db_board:
            raise ValueError("Board not found")

        candidates = get_candidates_all(db_board.board_state)
        return {"candidates": candidates}
