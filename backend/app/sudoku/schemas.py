from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class SudokuBoardBase(BaseModel):
    board_state: str


class SudokuBoardCreate(SudokuBoardBase):
    player1_id: int
    player2_id: int
    current_player_id: int


class SudokuBoardUpdate(BaseModel):
    board_state: Optional[str] = None
    current_player_id: Optional[int] = None
    status: Optional[str] = None
    winner_id: Optional[int] = None


class SudokuBoardInDBBase(SudokuBoardBase):
    id: int
    player1_id: int
    player2_id: int
    current_player_id: int
    status: str
    winner_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SudokuBoard(SudokuBoardInDBBase):
    pass


class SudokuBoardInDB(SudokuBoardInDBBase):
    pass


# Schema for creating a new game (challenge another player)
class GameChallenge(BaseModel):
    opponent_id: int


# Schema for making a move
class GameMove(BaseModel):
    row: int
    col: int
    value: int


# Schema for hint information
class Hint(BaseModel):
    strategy: str  # "naked_single", "hidden_single", "naked_pair", etc.
    explanation: str  # Human-readable explanation
    action: str  # What to do (e.g., "place value", "eliminate candidates")
    primary_cell: Optional[dict] = (
        None  # {"row": int, "col": int} - main cell to highlight
    )
    affected_cells: List[
        dict
    ] = []  # [{"row": int, "col": int}, ...] - cells involved in the strategy
    value: Optional[int] = None  # Value to place (for singles)
    candidates_to_remove: Optional[dict] = (
        None  # {"cells": [...], "values": [...]} - for eliminations
    )
