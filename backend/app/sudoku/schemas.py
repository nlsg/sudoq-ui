from pydantic import BaseModel, field_validator
from typing import Optional, List
from datetime import datetime
import json


class SudokuGameBase(BaseModel):
    board_state: str
    digit_types: Optional[List[str]] = None
    mistakes_p1: int
    mistakes_p2: int
    valid_moves_p1: int
    valid_moves_p2: int


class SudokuGameCreate(BaseModel):
    player1_id: int
    difficulty: Optional[str] = None
    digit_types: Optional[List[str]] = None


class SudokuGameInDBBase(SudokuGameBase):
    id: int
    player1_id: int
    player2_id: Optional[int] = None
    difficulty: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

    @field_validator("digit_types", mode="before")
    def parse_digit_types(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return []
        return v


class SudokuGame(SudokuGameInDBBase):
    pass


class SudokuGameInDB(SudokuGameInDBBase):
    pass


class GameChallenge(BaseModel):
    opponent_id: int


class GameMove(BaseModel):
    player_id: int
    row: int
    col: int
    value: int


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


class CandidatesMap(BaseModel):
    candidates: List[List[List[int]]]
