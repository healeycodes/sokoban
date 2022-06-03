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

const debug = { steps: 0 };

/** Perform a depth-first search for a solution.
`depth` should be set at or beyond the solution length.

This solve function is better than a brute force search by:
- Not revisiting previously seen level states
- Choosing moves that:
  - a) Move boxes onto goals (if possible)
  - b) Decrease the total distance of boxes from their nearest(*) goals

(*) "nearest" means the naive distance, as if there were no other blockers */
export function solve(level: LevelYX, depth: number) {
  // Don't revisit previously seen level states
  const seen = new Set();

  function innerSolve(
    level: LevelYX,
    depth: number,
    path: string
  ): false | string {
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

    for (let i = 0; i < dirs.length; i++) {
      const dir = dirs[i];
      let _path = path;
      const attempt = movePlayer(level, dir[0], dir[1], false);
      if (attempt !== false) {
        debug.steps++;
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
          return _path;
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
      const boxesOnGoals = (b[2] - a[2]) * 1000;
      const boxToGoalDistanceTotal = a[3] - b[3];
      return boxesOnGoals + boxToGoalDistanceTotal;
    });

    // Note: there might be zero unseen level states
    for (let i = 0; i < moves.length; i++) {
      const next = innerSolve(moves[i][0], depth - 1, moves[i][1]);
      if (next !== false) {
        return next;
      }
    }

    return false;
  }
  return innerSolve(level, depth, "");
}

// // Uncomment for a tighter feedback loop

// const level0 = `########
// #@ $.  #
// # $  . #
// #   $ .#
// # $  . #
// #   $ .#
// # $  . #
// #   $ .#
// #   $ .#
// # $  . #
// #   $ .#
// # $  . #
// #   $ .#
// # $  . #
// #   $ .#
// #   $ .#
// # $  . #
// #   $ .#
// ########`;

// import { parseLevel } from "./game";

// const level = parseLevel(level0);
// for (let i = 32; i < 50; i++) {
//   const result = solve(level, i);
//   if (result !== false) {
//     console.log(
//       `depth: ${i} steps: ${debug.steps} path(${result.length}): ${result}`
//     );
//     break;
//   }
//   debug.steps = 0;
// }
