import random
from typing import Optional, Tuple, Literal, List
from sudoq import Grid, reducers, Cell
from sudoq.generators import PuzzleGenerator, RandomCellReducer, DigitReducer
from sudoq.solvers import BacktrackingSolver

from app.config import settings

type Difficulty = Literal["easy", "medium", "hard"]


def generate_puzzle(difficulty: Difficulty = "medium") -> str:
    """Generate a Sudoku puzzle and return as string.

    Difficulty controls min_clues:
    - easy: 50-55 clues
    - medium: 45-50 clues
    - hard: 35-40 clues
    - expert: 25-30 clues
    """
    if difficulty == "easy":
        generator = PuzzleGenerator(reducers=[RandomCellReducer()], min_clues=25)
    elif difficulty == "medium":
        generator = PuzzleGenerator(reducers=[RandomCellReducer()], min_clues=0)
    elif difficulty == "hard":
        generator = PuzzleGenerator(
            reducers=[
                DigitReducer(random.choice(range(1, 10))),
                RandomCellReducer(),
            ],
        )
    elif difficulty == "expert":
        generator = PuzzleGenerator(
            max_clues=0,
            reducers=[
                reducers.SequentialReducer(
                    [
                        DigitReducer(random.choice(range(1, 10)), 0),
                        reducers.CompositeReducer(
                            [
                                DigitReducer(random.choice(range(1, 5)), 0),
                                DigitReducer(random.choice(range(1, 5))),
                                DigitReducer(random.choice(range(5, 10)), 0),
                                DigitReducer(random.choice(range(5, 10))),
                            ]
                        ),
                        reducers.RandomCellReducer(),
                        # reducers.RandomCellReducer()
                    ]
                )
            ],
        )

    else:
        raise ValueError("unknown difficulty")
    return generator.generate(tries=settings.MAX_GENERATION_TRIES).to_string()


def validate_grid(board_str: str) -> bool:
    """Check if grid is valid (no conflicts)."""
    try:
        return Grid.from_string(board_str).is_valid()
    except ValueError:
        return False


def is_solved(board_str: str) -> bool:
    """Check if grid is complete and valid."""
    try:
        grid = Grid.from_string(board_str)
        return grid.is_complete() and grid.is_valid()
    except ValueError:
        return False


def is_valid_move(board_str: str, row: int, col: int, value: int) -> bool:
    """Check if placing value at position is valid."""
    if not (0 <= row < 9 and 0 <= col < 9 and 1 <= value <= 9):
        return False
    grid = Grid.from_string(board_str)
    if grid.get_cell((row, col)) != 0:
        return False

    return value in grid.get_candidates((row, col))


def make_move(board_str: str, row: int, col: int, value: int) -> Optional[str]:
    """Make move if valid, return new board_str or None."""
    if not is_valid_move(board_str, row, col, value):
        return None
    grid = Grid.from_string(board_str)

    return grid.with_placement(Cell(position=(row, col), value=value)).to_string()


def get_solution(board_str: str) -> Optional[str]:
    """Return the fully solved board string if solvable, None otherwise."""
    try:
        grid = Grid.from_string(board_str)
        if grid.is_complete():
            return board_str
        solver = BacktrackingSolver()
        solved = solver.solve(grid)
        if solved.is_complete():
            return solved.to_string()
        return None
    except ValueError:
        return None


def get_hint(board_str: str) -> Optional[Tuple[int, int, int]]:
    """Return a hint (row, col, value) for an empty cell, or None if no hint."""
    try:
        grid = Grid.from_string(board_str)
        # Find empty cells
        empty_cells = []
        for r in range(9):
            for c in range(9):
                if grid.get_cell((r, c)) == 0:
                    empty_cells.append((r, c))
        if not empty_cells:
            return None
        solution = get_solution(board_str)
        if not solution:
            return None
        hint_pos = random.choice(empty_cells)
        r, c = hint_pos
        value = int(solution[r * 9 + c])
        return (r, c, value)
    except ValueError:
        return None


def get_candidates_all(board_str: str) -> List[List[List[int]]]:
    """Return all candidates as 9x9 list of lists of int."""
    try:
        grid = Grid.from_string(board_str)
        candidates = []
        for r in range(9):
            row = []
            for c in range(9):
                if grid.get_cell((r, c)) != 0:
                    row.append([])
                else:
                    row.append(list(grid.get_candidates((r, c))))
            candidates.append(row)
        return candidates
    except ValueError:
        return [[[0]]]
