import { parseLevel } from "../game";
import { solve } from "../solver";
import { level1, level2, level3, level4 } from "./test-levels";
import { microcosmos } from "../levels";

describe("levels can be solved", () => {
  test("level1", () => {
    const level = parseLevel(level1);
    const result = solve(level);
    expect(result[0]).toEqual("R");
    expect(result[1]).toEqual(1);
  });

  test("level2", () => {
    const level = parseLevel(level2);
    const result = solve(level);
    expect(result[0]).toEqual("rRlldRRRldRR");
    expect(result[1]).toEqual(51);
  });

  test("level3", () => {
    const level = parseLevel(level3);
    const result = solve(level);
    expect(result[0]).toEqual("ddrruRRlldlluRRRurrrddlUruLdLLdlluRRRRurDllluR");
    expect(result[1]).toEqual(5768);
  });

  test("level4", () => {
    const level = parseLevel(level4);
    const result = solve(level);
    expect(result[0]).toEqual("rDDDldRRRRR");
    expect(result[1]).toEqual(243);
  });
});

describe("microcosmos levels can be solved", () => {
  test("level0", () => {
    const level = parseLevel(microcosmos[0]);
    const result = solve(level);
    expect(result[0]).not.toEqual(false);
  });
  test("level1", () => {
    const level = parseLevel(microcosmos[1]);
    const result = solve(level);
    expect(result[0]).not.toEqual(false);
  });
  test("level2", () => {
    const level = parseLevel(microcosmos[2]);
    const result = solve(level);
    expect(result[0]).not.toEqual(false);
  });
  test("level3", () => {
    const level = parseLevel(microcosmos[3]);
    const result = solve(level);
    expect(result[0]).not.toEqual(false);
  });
  test("level4", () => {
    const level = parseLevel(microcosmos[4]);
    const result = solve(level);
    expect(result[0]).not.toEqual(false);
  });

  // TODO: Possible bug that these aren't solvable
  // test("level5", () => {
  //   const level = parseLevel(microcosmos[5]);
  //   const result = solve(level);
  //   expect(result[0]).not.toEqual(false);
  // });
  // test("level6", () => {
  //   const level = parseLevel(microcosmos[6]);
  //   const result = solve(level);
  //   expect(result[0]).not.toEqual(false);
  // });
});
