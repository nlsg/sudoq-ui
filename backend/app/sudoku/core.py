import random
from typing import Optional, Tuple, Literal, List
import copy
from sudoq import Grid, reducers, Cell
from sudoq.generators import PuzzleGenerator
from sudoq.generators.reducers import (
    GenericReducer,
    RandomCellReducer,
    DigitReducer,
    CompositeReducer,
    SequentialReducer,
)
from sudoq.solvers import BacktrackingSolver
from sudoq.solvers.strategies import all_strategies

from app.sudoku.schemas import Hint
from app.config import settings

type Difficulty = Literal["easy", "medium", "hard"]

_all_strategies = list(all_strategies)


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
        digits = set(range(1, 10))
        complete_reductions = random.choices(list(digits), k=2)
        partial_reductions = random.choices(
            list(digits - set(complete_reductions)), k=5
        )
        print(f"{complete_reductions=}\n{partial_reductions=}")
        generator = PuzzleGenerator(
            max_clues=0,
            min_clues=0,
            reducers=[DigitReducer(cr, 0) for cr in complete_reductions]
            + [
                CompositeReducer(
                    [DigitReducer(cr, 2) for cr in partial_reductions]
                    + [GenericReducer(lambda d: d not in partial_reductions + [0])]
                )
            ],
        )
    elif difficulty == "expert":
        generator = PuzzleGenerator(
            max_clues=0,
            reducers=[
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


def get_hint(board_str: str) -> Hint:
    """Find the next logical hint using strategic solver strategies."""
    try:
        grid = Grid.from_string(board_str)
        if grid.is_complete():
            return None

        random.shuffle(_all_strategies)
        for strategy in _all_strategies:
            cell = strategy.get_placement(grid)
            if cell:
                # Found a placement, convert to hint format
                r, c = cell.position
                value = cell.value

                # Get strategy name
                strategy_name = strategy.__class__.__name__.lower()

                # Create explanation based on strategy
                if strategy_name == "nakedsingle":
                    explanation = f"Cell ({r}, {c}) can only contain {value}"
                elif strategy_name == "hiddensingle":
                    explanation = f"Value {value} can only go in cell ({r}, {c}) in its row/column/box"
                elif strategy_name in ["nakedpair", "nakedtriple", "nakedquad"]:
                    set_name = strategy_name.replace("naked", "").lower()
                    explanation = f"Naked {set_name} eliminates candidates, allowing {value} at ({r}, {c})"
                elif strategy_name in ["hiddenpair", "hiddentriple", "hiddenquad"]:
                    set_name = strategy_name.replace("hidden", "").lower()
                    explanation = (
                        f"Hidden {set_name} indicates {value} belongs at ({r}, {c})"
                    )
                else:
                    explanation = f"{strategy_name.replace('_', ' ').title()} technique found {value} at ({r}, {c})"

                return Hint(
                    strategy=strategy_name,
                    explanation=explanation,
                    action="place_value",
                    primary_cell={"row": r, "col": c},
                    affected_cells=[{"row": r, "col": c}],
                    value=value,
                )

        # No logical hint found, fall back to revealing a value
        solution = get_solution(board_str)
        if not solution:
            return None

        empty_cells = [
            (r, c) for r in range(9) for c in range(9) if grid.get_cell((r, c)) == 0
        ]
        if not empty_cells:
            return None

        r, c = random.choice(empty_cells)
        value = int(solution[r * 9 + c])
        return {
            "strategy": "solution_hint",
            "explanation": f"The value {value} goes in cell ({r}, {c}).",
            "action": "place_value",
            "primary_cell": {"row": r, "col": c},
            "affected_cells": [{"row": r, "col": c}],
            "value": value,
        }

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
