import {
  LevelYX,
  movePlayer,
  checkGameWon,
  findChar,
  BOX_ON_GOAL,
  BOX,
  GOAL,
  PLAYER_ON_GOAL,
  cloneLevel,
} from ".";

type Path = string | boolean;
type Steps = number;
type BoxesOnGoals = number;
type BoxesToGoalsManhattanDistance = number;

/** Perform a breadth-first search for a solution.

This solve function is better than a brute force search by:
- Not revisiting previously seen level states
- Choosing moves that:
  - a) Move boxes onto goals (if possible)
  - b) Decrease the total distance of boxes from their nearest(*) goals

(*) "nearest" means the Manhattan distance without taking blocking objects
into account. */
export function solve(level: LevelYX): [Path, Steps] {
  // Track work done so we can analyze and benchmark
  let steps = 1;

  // Don't revisit previously seen level states
  const seen = new Set();

  // List of legal directions
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  const queue: [LevelYX, Path][] = [[cloneLevel(level), ""]];

  while (queue.length > 0) {
    const next = queue.shift();
    if (next === undefined) {
      throw "Unreachable";
    }
    const [current, path] = next;

    // Serialize the level
    const snapshot = JSON.stringify(current);
    if (seen.has(snapshot)) {
      continue;
    }
    seen.add(snapshot);

    // Short circuit on a winning board
    if (checkGameWon(current)) {
      return [path, steps];
    }

    const moves: [
      LevelYX,
      Path,
      BoxesOnGoals,
      BoxesToGoalsManhattanDistance
    ][] = [];

    for (let i = 0; i < dirs.length; i++) {
      steps++;

      const dir = dirs[i];
      let _path = path;
      const attempt = movePlayer(current, dir[0], dir[1], false);
      if (attempt !== false) {
        const clone = cloneLevel(current);

        _path += attempt;
        movePlayer(clone, dir[0], dir[1], true);

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
      // Prioritize moves that push boxes onto goals
      const boxesOnGoals = (b[2] - a[2]) * 1000;
      // Then sort by the total Manhattan distance of boxes to goals
      const boxToGoalDistanceTotal = a[3] - b[3];
      return boxesOnGoals + boxToGoalDistanceTotal;
    });

    const futureWork: [LevelYX, Path][] = moves.map((move) => [
      move[0],
      move[1],
    ]);
    queue.push(...futureWork);
  }

  return [false, -1];
}
