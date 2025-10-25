from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    boards_as_player1 = relationship(
        "SudokuBoard", back_populates="player1", foreign_keys="SudokuBoard.player1_id"
    )
    boards_as_player2 = relationship(
        "SudokuBoard", back_populates="player2", foreign_keys="SudokuBoard.player2_id"
    )
