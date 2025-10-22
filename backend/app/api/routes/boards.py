from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_

from database import get_db
from app.schemas.board import SudokuBoard, SudokuBoardCreate, SudokuBoardUpdate
from app.db.models import SudokuBoard as SudokuBoardModel, User

router = APIRouter()


@router.post("/", response_model=SudokuBoard)
async def create_board(board: SudokuBoardCreate, db: AsyncSession = Depends(get_db)):
    # Check if players exist
    result = await db.execute(
        select(User).where(User.id.in_([board.player1_id, board.player2_id]))
    )
    users = result.scalars().all()
    if len(users) != 2:
        raise HTTPException(status_code=404, detail="One or both players not found")

    # Create new board
    db_board = SudokuBoardModel(
        board_state=board.board_state,
        player1_id=board.player1_id,
        player2_id=board.player2_id,
        current_player_id=board.current_player_id,
    )
    db.add(db_board)
    await db.commit()
    await db.refresh(db_board)
    return db_board


@router.get("/{board_id}", response_model=SudokuBoard)
async def read_board(board_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(SudokuBoardModel).where(SudokuBoardModel.id == board_id)
    )
    board = result.scalar_one_or_none()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    return board


@router.get("/", response_model=List[SudokuBoard])
async def read_boards(
    player_id: int = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
):
    query = select(SudokuBoardModel)
    if player_id:
        query = query.where(
            or_(
                SudokuBoardModel.player1_id == player_id,
                SudokuBoardModel.player2_id == player_id,
            )
        )
    result = await db.execute(query.offset(skip).limit(limit))
    boards = result.scalars().all()
    return boards


@router.put("/{board_id}", response_model=SudokuBoard)
async def update_board(
    board_id: int, board: SudokuBoardUpdate, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(SudokuBoardModel).where(SudokuBoardModel.id == board_id)
    )
    db_board = result.scalar_one_or_none()
    if not db_board:
        raise HTTPException(status_code=404, detail="Board not found")

    # Update fields
    for key, value in board.model_dump(exclude_unset=True).items():
        if hasattr(db_board, key):
            setattr(db_board, key, value)

    await db.commit()
    await db.refresh(db_board)
    return db_board


@router.delete("/{board_id}")
async def delete_board(board_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(SudokuBoardModel).where(SudokuBoardModel.id == board_id)
    )
    board = result.scalar_one_or_none()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")

    await db.delete(board)
    await db.commit()
    return {"message": "Board deleted"}
