# Import all models to register them with SQLAlchemy
from app.users.models import User
from app.sudoku.models import SudokuGame

__all__ = ["User", "SudokuGame"]
