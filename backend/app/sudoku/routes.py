from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.sudoku.schemas import (
    SudokuGame,
    SudokuGameCreate,
    GameMove,
    Hint,
)
from app.sudoku.service import GameService

router = APIRouter()


def get_game_service(db: AsyncSession = Depends(get_db)) -> GameService:
    # Dependency injection for GameService
    return GameService(db)


@router.post("/", response_model=SudokuGame)
async def create_game(
    game: SudokuGameCreate, service: GameService = Depends(get_game_service)
):
    try:
        db_game = await service.create_game(
            game.board_state,
            game.player1_id,
            game.player2_id,
            game.difficulty,
        )
        return db_game
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{game_id}", response_model=SudokuGame)
async def read_game(game_id: int, service: GameService = Depends(get_game_service)):
    game = await service.get_game(game_id)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    return game


@router.get("/", response_model=List[SudokuGame])
async def read_games(
    player_id: int = None,
    skip: int = 0,
    limit: int = 100,
    service: GameService = Depends(get_game_service),
):
    games = await service.get_games(player_id, skip, limit)
    return games


@router.delete("/{game_id}")
async def delete_game(game_id: int, service: GameService = Depends(get_game_service)):
    success = await service.delete_game(game_id)
    if not success:
        raise HTTPException(status_code=404, detail="Game not found")
    return {"message": "Game deleted"}


@router.post("/singleplayer", response_model=SudokuGame)
async def create_singleplayer_game(
    user_id: int,
    difficulty: str = "medium",
    service: GameService = Depends(get_game_service),
):
    db_game = await service.create_singleplayer_game(user_id, difficulty)
    return db_game


@router.put("/{game_id}/move", response_model=SudokuGame)
async def make_move_on_game(
    game_id: int,
    move: GameMove,
    service: GameService = Depends(get_game_service),
):
    try:
        db_game = await service.make_move(
            game_id, move.player_id, move.row, move.col, move.value
        )
        return db_game
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{game_id}/hint", response_model=Hint)
async def get_hint_for_game(
    game_id: int, service: GameService = Depends(get_game_service)
):
    try:
        hint = await service.get_hint(game_id)
        return hint
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{game_id}/solve")
async def solve_game(game_id: int, service: GameService = Depends(get_game_service)):
    try:
        solution = await service.solve_game(game_id)
        return solution
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{game_id}/candidates")
async def get_candidates(
    game_id: int, service: GameService = Depends(get_game_service)
):
    try:
        candidates = await service.get_candidates(game_id)
        return candidates
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
