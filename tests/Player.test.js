import Player from "/src/model/Player.js";

describe("Player", () => {
  test("modulee exists and returns an object", () => {
    expect(() => new Player()).toBeInstanceOf(Object);
  });

  describe("constructor()", () => {
    test("expected properties returns expected values", () => {
      const player = new Player(3, "#aeefff", 8);
      expect(player.isActive).toBe(false);
      expect(player.id).toBe(3);
      expect(player.color).toBe("#aeefff");
      expect(player.readyState).toBe(false);
    });
  });

  describe("methods exist", () => {
    test.each([
      ["isReady"],
      ["getTracker"],
      ["updateTracker"],
      ["setShip"],
      ["getMove"],
    ])("player.%s is a function", (fn) => {
      const player = new Player();
      expect(player[fn]).toBeInstanceOf(Function);
    });
  });

  describe("methods require subclass implementation", () => {
    test.each([["setShip"], ["getMove"]])("player.%s is a function", (fn) => {
      const player = new Player();
      expect(() => player[fn]()).toThrow(/must be implemented by subclass/);
    });
  });

  describe("isReady()", () => {
    const player = new Player();
    test("0 positioned ships return false", () => {
      expect(player.isReady()).toBe(false);
    });
  });

  describe("getTracker()", () => {
    test("tracker returns default dimensions", () => {
      const player = new Player();
      expect(player.getTracker()).toEqual(
        expect.arrayContaining(Array.from({ length: 7 }, () => Array(7))),
      );
    });

    test("tracker returns expected dimensions", () => {
      const player = new Player(0, "red", 9);
      expect(player.getTracker()).toEqual(
        expect.arrayContaining(Array.from({ length: 9 }, () => Array(9))),
      );
    });
  });

  describe("updateTracker()", () => {
    const player = new Player(0, "red", 9);
    test.each([
      [0, 3, 3, 0],
      [0, 2, 2, 0],
    ])(
      "updateTracker([%i, %i] to update in tracker[%i][%i]",
      (x, y, tY, tX) => {
        player.updateTracker([x, y]);
        expect(player.getTracker()[tY][tX]).toBe(false);
      },
    );
  });
});
