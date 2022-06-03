import { parseLevel } from "../game";
import { solve } from "../solver";
import { level1, level2 } from "../levels";

describe("levels can be solved", () => {
  test("level1", () => {
    const level = parseLevel(level1);
    expect(solve(level, 1)).toEqual("R");
  });

  test("level2", () => {
    const level = parseLevel(level2);
    expect(solve(level, 11)).toEqual("rRlldRRRldRR");
  });
});
