from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


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
