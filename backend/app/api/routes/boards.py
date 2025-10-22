from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_

from app.database import get_db
from app.schemas.board import (
    SudokuBoardBase,
    SudokuBoard,
    SudokuBoardCreate,
    SudokuBoardUpdate,
    GameMove,
)
from app.db.models import SudokuBoard as SudokuBoardModel, User
from app.core.sudoku import (
    generate_puzzle,
    is_solved,
    make_move,
    get_hint,
    get_solution,
)

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


@router.post("/singleplayer", response_model=SudokuBoard)
async def create_singleplayer_board(
    user_id: int, difficulty: str = "medium", db: AsyncSession = Depends(get_db)
):
    """Generate and create a new singleplayer board."""
    # Check if user exists, create if not
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        # Create dummy user for demo
        dummy_user = User(
            username=f"user{user_id}",
            email=f"user{user_id}@example.com",
            hashed_password="dummy",
            is_active=True,
        )
        db.add(dummy_user)
        await db.commit()
        await db.refresh(dummy_user)
        user = dummy_user

    # Generate puzzle
    board_state = generate_puzzle()

    # Create board with player1 and player2 as same user (for singleplayer)
    db_board = SudokuBoardModel(
        board_state=board_state,
        player1_id=user_id,
        player2_id=user_id,
        current_player_id=user_id,
        status="ongoing",
    )
    db.add(db_board)
    await db.commit()
    await db.refresh(db_board)
    return db_board


@router.put("/{board_id}/move", response_model=SudokuBoard)
async def make_move_on_board(
    board_id: int, move: GameMove, db: AsyncSession = Depends(get_db)
):
    """Make a move on a board if valid."""
    result = await db.execute(
        select(SudokuBoardModel).where(SudokuBoardModel.id == board_id)
    )
    db_board = result.scalar_one_or_none()
    if not db_board:
        raise HTTPException(status_code=404, detail="Board not found")

    if db_board.status != "ongoing":
        raise HTTPException(status_code=400, detail="Game is not ongoing")

    new_state = make_move(db_board.board_state, move.row, move.col, move.value)
    if new_state is None:
        raise HTTPException(status_code=400, detail="Invalid move")

    db_board.board_state = new_state

    if is_solved(new_state):
        db_board.status = "completed"
        db_board.winner_id = db_board.current_player_id

    await db.commit()
    await db.refresh(db_board)
    return db_board


@router.get("/{board_id}/hint")
async def get_hint_for_board(board_id: int, db: AsyncSession = Depends(get_db)):
    """Get a hint for the board."""
    result = await db.execute(
        select(SudokuBoardModel).where(SudokuBoardModel.id == board_id)
    )
    db_board = result.scalar_one_or_none()
    if not db_board:
        raise HTTPException(status_code=404, detail="Board not found")

    hint = get_hint(db_board.board_state)
    if hint is None:
        raise HTTPException(status_code=400, detail="No hint available")

    return {"row": hint[0], "col": hint[1], "value": hint[2]}


@router.get("/{board_id}/solve")
async def solve_board(board_id: int, db: AsyncSession = Depends(get_db)):
    """Get the solution for the board."""
    result = await db.execute(
        select(SudokuBoardModel).where(SudokuBoardModel.id == board_id)
    )
    db_board = result.scalar_one_or_none()
    if not db_board:
        raise HTTPException(status_code=404, detail="Board not found")

    solution = get_solution(db_board.board_state)
    if solution is None:
        raise HTTPException(status_code=400, detail="Board is not solvable")

    return {"solution": solution}
