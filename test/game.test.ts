import { newGame } from "../game";
import { level1, level1_5, level2 } from "../levels";

describe("levels can be completed", () => {
  it("level1", () => {
    const game = newGame(level1);
    // Check that starting state is not winning
    expect(game.hasWon()).toBe(false);
    game.move([1, 0]);
    expect(game.hasWon()).toBe(true);
  });

  it("level2", () => {
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
  it("moving into walls", () => {
    const game = newGame(level1);
    // Moving into walls is a no-op
    game.move([-1, 0]);
    game.move([0, 1]);
    game.move([0, -1]);
    // This is the real move
    game.move([1, 0]);
    expect(game.hasWon()).toBe(true);
  });
});

describe("undo/score functionality", () => {
  it("works", () => {
    const game = newGame(level1_5);
    game.move([1, 0]);
    expect(game.score()).toEqual([1, 1]);
    game.undo();
    expect(game.score()).toEqual([0, 0]);

    game.move([1, 0]);
    game.move([-1, 0]);
    expect(game.score()).toEqual([2, 1]);
  });
});
