from typing import List, Optional, Tuple
from sudoq import Grid
from sudoq.generators import PuzzleGenerator, RandomCellReducer
from sudoq.core import Position


def generate_puzzle(difficulty: str = "medium") -> str:
    """Generate a Sudoku puzzle and return as string.

    Difficulty controls min_clues or reducers.
    For simplicity, use random reduction.
    """
    gen = PuzzleGenerator(
        reducers=[RandomCellReducer()], min_clues=30
    )  # around 30 clues for medium
    puzzle = gen.generate()
    return grid_to_str(puzzle)


def parse_grid(board_str: str) -> Grid:
    """Parse 81-digit string into Grid."""
    if len(board_str) != 81 or not all(c in "0123456789" for c in board_str):
        raise ValueError("Invalid board string")
    return Grid.from_string(board_str)


def validate_grid(board_str: str) -> bool:
    """Check if grid is valid (no conflicts)."""
    try:
        grid = parse_grid(board_str)
        return grid.is_valid()
    except ValueError:
        return False


def is_solved(board_str: str) -> bool:
    """Check if grid is complete and valid."""
    try:
        grid = parse_grid(board_str)
        return grid.is_complete() and grid.is_valid()
    except ValueError:
        return False


def is_valid_move(board_str: str, row: int, col: int, value: int) -> bool:
    """Check if placing value at position is valid."""
    if not (0 <= row < 9 and 0 <= col < 9 and 1 <= value <= 9):
        return False
    grid = parse_grid(board_str)
    if grid.get_cell((row, col)) != 0:
        return False  # only empty cells
    # Check if value is in candidates
    candidates = grid.get_candidates((row, col))
    return value in candidates


def make_move(board_str: str, row: int, col: int, value: int) -> Optional[str]:
    """Make move if valid, return new board_str or None."""
    if not is_valid_move(board_str, row, col, value):
        return None
    grid = parse_grid(board_str)
    from sudoq.core import Cell

    new_grid = grid.with_placement(Cell(position=(row, col), value=value))
    return grid_to_str(new_grid)


# Helper to get string from Grid (81 digits)
def grid_to_str(grid: Grid) -> str:
    """Convert Grid to 81-digit string."""
    return "".join(str(v) for unit in grid.rows for v in unit.values)
