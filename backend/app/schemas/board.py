from pydantic import BaseModel
from typing import Optional, Dict, Any
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
