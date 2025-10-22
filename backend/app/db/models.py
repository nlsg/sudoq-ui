from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean
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


class SudokuBoard(Base):
    __tablename__ = "sudoku_boards"

    id = Column(Integer, primary_key=True, index=True)
    board_state = Column(Text, nullable=False)  # Serialized game state
    player1_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    player2_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    current_player_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String, default="ongoing")  # ongoing, completed, abandoned
    winner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    player1 = relationship(
        "User", back_populates="boards_as_player1", foreign_keys=[player1_id]
    )
    player2 = relationship(
        "User", back_populates="boards_as_player2", foreign_keys=[player2_id]
    )
    current_player = relationship("User", foreign_keys=[current_player_id])
    winner = relationship("User", foreign_keys=[winner_id])
