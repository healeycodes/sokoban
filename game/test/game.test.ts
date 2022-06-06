import { newGame } from "..";
import { level1, level1_5, level2 } from "./test-levels";

describe("levels can be completed", () => {
  test("level1", () => {
    const game = newGame(level1);
    // Check that starting state is not winning
    expect(game.hasWon()).toBe(false);
    game.move([1, 0]);
    expect(game.hasWon()).toBe(true);
  });

  test("level2", () => {
    const game = newGame(level2);
    game.move([1, 0]);
    game.move([1, 0]);
    game.move([-1, 0]);
    game.move([-1, 0]);
    game.move([0, 1]);
    game.move([1, 0]);
    game.move([1, 0]);
    game.move([1, 0]);
    game.move([-1, 0]);
    game.move([0, 1]);
    game.move([1, 0]);
    game.move([1, 0]);
    expect(game.hasWon()).toBe(true);
  });
});

describe("movement edge cases are handled", () => {
  test("moving into walls", () => {
    const game = newGame(level1);
    // Moving into walls is a no-op
    game.move([-1, 0]);
    game.move([0, 1]);
    game.move([0, -1]);
    // This is the real move
    game.move([1, 0]);
    expect(game.hasWon()).toBe(true);
  });

  test("move box off goal", () => {
    const game = newGame(level2);
    game.move([1, 0]);
    game.move([1, 0]);
    game.move([1, 0]);
    expect(game.state()[1][4]).toBe("+");
    expect(game.state()[1][5]).toBe("$");
  });
});

describe("undo functionality", () => {
  test("scores can be mutated", () => {
    const game = newGame(level1_5);
    game.move([1, 0]);
    expect(game.score()).toEqual([1, 1]);
    game.undo();
    expect(game.score()).toEqual([0, 0]);

    game.move([1, 0]);
    game.move([-1, 0]);
    expect(game.score()).toEqual([2, 1]);
  });

  test("level state can be mutated", () => {
    const game = newGame(level1_5);
    expect(game.state()[1][1]).toBe("@");
    game.move([1, 0]);
    expect(game.state()[1][1]).toBe(" ");
    game.undo();
    expect(game.state()[1][1]).toBe("@");
  });

  test("solution is tracked", () => {
    const game = newGame(level1_5);
    game.move([1, 0]);
    game.move([-1, 0]);
    game.move([1, 0]);
    expect(game.solution()).toBe("Rlr");
  });
});
