from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.board import (
    SudokuBoardBase,
    SudokuBoard,
    SudokuBoardCreate,
    SudokuBoardUpdate,
    GameMove,
)
from app.services.board_service import BoardService

router = APIRouter()


def get_board_service(db: AsyncSession = Depends(get_db)) -> BoardService:
    # Dependency injection for BoardService
    return BoardService(db)


@router.post("/", response_model=SudokuBoard)
async def create_board(
    board: SudokuBoardCreate, service: BoardService = Depends(get_board_service)
):
    try:
        db_board = await service.create_board(
            board.board_state,
            board.player1_id,
            board.player2_id,
            board.current_player_id,
        )
        return db_board
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{board_id}", response_model=SudokuBoard)
async def read_board(board_id: int, service: BoardService = Depends(get_board_service)):
    board = await service.get_board(board_id)
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    return board


@router.get("/", response_model=List[SudokuBoard])
async def read_boards(
    player_id: int = None,
    skip: int = 0,
    limit: int = 100,
    service: BoardService = Depends(get_board_service),
):
    boards = await service.get_boards(player_id, skip, limit)
    return boards


@router.put("/{board_id}", response_model=SudokuBoard)
async def update_board(
    board_id: int,
    board: SudokuBoardUpdate,
    service: BoardService = Depends(get_board_service),
):
    db_board = await service.update_board(
        board_id, board.model_dump(exclude_unset=True)
    )
    if not db_board:
        raise HTTPException(status_code=404, detail="Board not found")
    return db_board


@router.delete("/{board_id}")
async def delete_board(
    board_id: int, service: BoardService = Depends(get_board_service)
):
    success = await service.delete_board(board_id)
    if not success:
        raise HTTPException(status_code=404, detail="Board not found")
    return {"message": "Board deleted"}


@router.post("/singleplayer", response_model=SudokuBoard)
async def create_singleplayer_board(
    user_id: int,
    difficulty: str = "medium",
    service: BoardService = Depends(get_board_service),
):
    db_board = await service.create_singleplayer_board(user_id, difficulty)
    return db_board


@router.put("/{board_id}/move", response_model=SudokuBoard)
async def make_move_on_board(
    board_id: int,
    move: GameMove,
    service: BoardService = Depends(get_board_service),
):
    try:
        db_board = await service.make_move(board_id, move.row, move.col, move.value)
        return db_board
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{board_id}/hint")
async def get_hint_for_board(
    board_id: int, service: BoardService = Depends(get_board_service)
):
    try:
        hint = await service.get_hint(board_id)
        return hint
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{board_id}/solve")
async def solve_board(
    board_id: int, service: BoardService = Depends(get_board_service)
):
    try:
        solution = await service.solve_board(board_id)
        return solution
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
