# Import all models to register them with SQLAlchemy
from app.users.models import User
from app.boards.models import SudokuBoard

__all__ = ["User", "SudokuBoard"]
