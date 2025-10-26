from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class SudokuGameBase(BaseModel):
    board_state: str
    mistakes_p1: int
    mistakes_p2: int
    valid_moves_p1: int
    valid_moves_p2: int


class SudokuGameCreate(SudokuGameBase):
    player1_id: int
    player2_id: Optional[int] = None
    difficulty: Optional[str] = None


class SudokuGameInDBBase(SudokuGameBase):
    id: int
    player1_id: int
    player2_id: Optional[int] = None
    difficulty: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SudokuGame(SudokuGameInDBBase):
    pass


class SudokuGameInDB(SudokuGameInDBBase):
    pass


# Schema for creating a new game (challenge another player)
class GameChallenge(BaseModel):
    opponent_id: int


# Schema for making a move
class GameMove(BaseModel):
    player_id: int
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
