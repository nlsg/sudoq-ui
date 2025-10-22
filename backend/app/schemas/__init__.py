# Import all schemas
from .user import (
    User,
    UserCreate,
    UserUpdate,
    UserInDB,
)
from .board import (
    SudokuBoard,
    SudokuBoardCreate,
    SudokuBoardUpdate,
    GameChallenge,
    GameMove,
)

__all__ = [
    "User",
    "UserCreate",
    "UserUpdate",
    "UserInDB",
    "SudokuBoard",
    "SudokuBoardCreate",
    "SudokuBoardUpdate",
    "GameChallenge",
    "GameMove",
]
