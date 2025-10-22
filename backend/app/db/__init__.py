# Import all models to register them with SQLAlchemy
from .models import User, SudokuBoard

__all__ = ["User", "SudokuBoard"]
