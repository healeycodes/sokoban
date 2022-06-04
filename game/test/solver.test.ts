import { parseLevel } from "../game";
import { solve } from "../solver";
import { level1, level2, level3, level4 } from "../test-levels";

describe("levels can be solved", () => {
  test("level1", () => {
    const level = parseLevel(level1);
    const result = solve(level, 1);
    expect(result[0]).toEqual("R");
    expect(result[1]).toEqual(1);
  });

  test("level2", () => {
    const level = parseLevel(level2);
    const result = solve(level, 11);
    expect(result[0]).toEqual("rRlldRRRldRR");
    expect(result[1]).toEqual(52);
  });

  test("level3", () => {
    const level = parseLevel(level3);
    const result = solve(level, 11);
    expect(result[0]).toEqual("ddrruRRlldlluRRRurrrddlUruLdLLdlluRRRRurDllluR");
    expect(result[1]).toEqual(5768);
  });

  test.only("level4", () => {
    const level = parseLevel(level4);
    const result = solve(level, 11);
    // expect(result[0]).toEqual("rDDDldRRRRR");
    expect(result[1]).toEqual(243);
  });
});
