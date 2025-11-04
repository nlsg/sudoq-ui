from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class SudokuGame(Base):
    __tablename__ = "sudoku_games"

    id = Column(Integer, primary_key=True, index=True)
    board_state = Column(Text, nullable=False)  # Serialized game state
    digit_types = Column(
        Text, nullable=True
    )  # JSON string of digit types (e.g., ["1","2",...,"9"] or ["😉","😂",...])
    difficulty = Column(String, nullable=True)
    player1_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    player2_id = Column(
        Integer, ForeignKey("users.id"), nullable=True
    )  # Nullable for single-player
    mistakes_p1 = Column(Integer, default=0)
    mistakes_p2 = Column(Integer, default=0)
    valid_moves_p1 = Column(Integer, default=0)
    valid_moves_p2 = Column(Integer, default=0)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    player1 = relationship(
        "User", back_populates="games_as_player1", foreign_keys=[player1_id]
    )
    player2 = relationship(
        "User", back_populates="games_as_player2", foreign_keys=[player2_id]
    )
