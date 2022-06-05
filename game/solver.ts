import {
  LevelYX,
  movePlayer,
  checkGameWon,
  findChar,
  BOX_ON_GOAL,
  BOX,
  GOAL,
  PLAYER_ON_GOAL,
} from "./game";

const stats = { steps: 0 };

/** Perform a depth-first search for a solution.

This solve function is better than a brute force search by:
- Not revisiting previously seen level states
- Choosing moves that:
  - a) Move boxes onto goals (if possible)
  - b) Decrease the total distance of boxes from their nearest(*) goals

(*) "nearest" means the naive distance, as if there were no other blockers */
export function solve(level: LevelYX) {
  // Reset steps
  stats.steps = 0;

  // Don't revisit previously seen level states
  const seen = new Set();

  function innerSolve(
    level: LevelYX,
    path: string
  ): [false, number] | [string, number] {
    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];

    const moves: [
      // Cloned level
      LevelYX,
      // Path so far
      string,
      // Boxes on goals
      number,
      // Boxes to goals Manhattan distance
      number
    ][] = [];

    // Prove up to four of the next legal moves and apply move ordering based on
    // moving boxes onto goals, and the total Manhattan distance of boxes to goals.
    // Also check if any of the next legal moves are the winning move
    for (let i = 0; i < dirs.length; i++) {
      const dir = dirs[i];
      let _path = path;
      const attempt = movePlayer(level, dir[0], dir[1], false);
      if (attempt !== false) {
        stats.steps++;
        const clone = JSON.parse(JSON.stringify(level));
        _path += attempt;
        movePlayer(clone, dir[0], dir[1], true);

        const snapshot = JSON.stringify(clone);
        if (seen.has(snapshot)) {
          continue;
        }
        seen.add(snapshot);

        // Short circuit on a game-winning move
        if (checkGameWon(clone)) {
          return [_path, stats.steps];
        }

        const boxes = findChar(clone, BOX);
        const goals = [
          ...findChar(clone, GOAL),
          ...findChar(clone, PLAYER_ON_GOAL),
        ];
        let distanceTotal = 0;
        for (let j = 0; j < boxes.length; j++) {
          distanceTotal +=
            Math.abs(boxes[j][0] - goals[j][0]) +
            Math.abs(boxes[j][1] - goals[j][1]);
        }

        moves.push([
          clone,
          _path,
          findChar(clone, BOX_ON_GOAL).length,
          distanceTotal,
        ]);
      }
    }

    moves.sort((a, b) => {
      // Weight boxes onto goals highest
      const boxesOnGoals = (b[2] - a[2]) * 1000;
      // Otherwise, if there's a tie, fallback to this
      const boxToGoalDistanceTotal = a[3] - b[3];
      return boxesOnGoals + boxToGoalDistanceTotal;
    });

    // Note: there might be zero unseen level states
    for (let i = 0; i < moves.length; i++) {
      const next = innerSolve(moves[i][0], moves[i][1]);
      if (next[0] !== false) {
        return next;
      }
    }

    return [false, -1];
  }
  return innerSolve(level, "");
}
