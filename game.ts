export type LevelYX = string[][];
type XY = [number, number];
type MovesAndPushes = [number, number];
type Game = {
  state: () => LevelYX;
  hasWon: () => boolean;
  move: (dir: XY) => void;
  undo: () => void;
  score: () => MovesAndPushes;
};

export const WALL = "#";
export const PLAYER = "@";
export const PLAYER_ON_GOAL = "+";
export const BOX = "$";
export const BOX_ON_GOAL = "*";
export const GOAL = ".";
export const FLOOR = " ";

export function parseLevel(levelText: string): LevelYX {
  return (
    levelText
      .split("\n")
      // Trim trailing lines before/after level
      .filter((line) => line.length !== 0)
      .map((line) => line.split(""))
  );
}

export function findChar(level: LevelYX, char: string): XY[] {
  const found: XY[] = [];
  for (let y = 0; y < level.length; y++) {
    for (let x = 0; x < level[y].length; x++) {
      if (level[y][x] === char) {
        found.push([x, y]);
      }
    }
  }
  return found;
}

export function movePlayer(
  level: LevelYX,
  dirX: number,
  dirY: number,
  apply: boolean
): false | string {
  const player =
    findChar(level, PLAYER).length === 0
      ? findChar(level, PLAYER_ON_GOAL)
      : findChar(level, PLAYER);
  const [playerX, playerY] = player[0];
  const [targetX, targetY] = [playerX + dirX, playerY + dirY];

  if (level[targetY][targetX] === FLOOR || level[targetY][targetX] === GOAL) {
    if (apply) {
      swapChars(level, playerX, playerY, targetX, targetY);
    }
    return dirToDesc(dirX, dirY);
  }

  if (level[targetY][targetX] === WALL) {
    return false;
  }

  if (
    level[targetY][targetX] === BOX ||
    level[targetY][targetX] === BOX_ON_GOAL
  ) {
    const [boxTargetX, boxTargetY] = [targetX + dirX, targetY + dirY];
    if (
      level[boxTargetY][boxTargetX] === FLOOR ||
      level[boxTargetY][boxTargetX] === GOAL
    ) {
      if (apply) {
        swapChars(level, targetX, targetY, boxTargetX, boxTargetY);
        swapChars(level, playerX, playerY, targetX, targetY);
      }
      return dirToDesc(dirX, dirY).toUpperCase();
    }
    return false;
  }

  throw "Unexpected game state";
}

function dirToDesc(x: number, y: number) {
  if (x === 1 && y === 0) {
    return "r";
  } else if (x === -1 && y === 0) {
    return "l";
  } else if (x === 0 && y === 1) {
    return "d";
  } else if (x === 0 && y === -1) {
    return "u";
  }

  throw "Unknown direction";
}

function swapChars(
  level: LevelYX,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  const swap = () => {
    [level[y1][x1], level[y2][x2]] = [level[y2][x2], level[y1][x1]];
  };

  if (level[y1][x1] === PLAYER && level[y2][x2] === FLOOR) {
    swap();
  }
  if (level[y1][x1] === BOX && level[y2][x2] === FLOOR) {
    swap();
  }
  if (level[y1][x1] === PLAYER && level[y2][x2] === GOAL) {
    level[y1][x1] = FLOOR;
    level[y2][x2] = PLAYER_ON_GOAL;
  }
  if (level[y1][x1] === BOX && level[y2][x2] === GOAL) {
    level[y1][x1] = FLOOR;
    level[y2][x2] = BOX_ON_GOAL;
  }
}

export function checkGameWon(level: LevelYX) {
  // We can just check that there are no boxes.
  // All the boxes should be BOX_ON_GOAL
  return findChar(level, BOX).length === 0;
}

export function newGame(levelText: string): Game {
  const history: LevelYX[] = [parseLevel(levelText)];
  const scores: MovesAndPushes[] = [];
  return {
    state: () => {
      return history[history.length - 1];
    },
    hasWon: () => {
      return checkGameWon(history[history.length - 1]);
    },
    move: (dir) => {
      const clone = JSON.parse(JSON.stringify(history[history.length - 1]));
      const direction = movePlayer(clone, dir[0], dir[1], true);
      if (direction !== false) {
        history.push(clone);
        if (direction === direction.toUpperCase()) {
          scores.push([1, 1]);
        } else {
          scores.push([1, 0]);
        }
      }
    },
    undo: () => {
      if (history.length > 1) {
        scores.pop();
        const previous = history.pop();
        // This check is unnecessary but let's make TypeScript happy
        if (previous) {
          history[history.length - 1] = previous;
        }
      }
    },
    score: () => {
      return scores.reduce(
        (prev, cur) => {
          return [prev[0] + cur[0], prev[1] + cur[1]];
        },
        [0, 0]
      );
    },
  };
}
