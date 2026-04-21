import Player from "../src/model/Player.js";
import AIPlayer from "../src/model/AIPlayer.js";

describe("AIPlayer", () => {
  test("modulee exists and inherits from Object and Player", () => {
    expect(new AIPlayer()).toBeInstanceOf(Object);
    expect(new AIPlayer()).toBeInstanceOf(Player);
  });

  describe("methods require subclass implementation", () => {
    test.each([["setShip"], ["getMove"]])("player.%s is implemented", (fn) => {
      const player = new AIPlayer();
      expect(() => player[fn]()).not.toThrow(/must be implemented by subclass/);
    });
  });

  describe("receiveAttack()", () => {
    test("receiveAttack() is a hit", () => {
      const player = new AIPlayer(0, "red", 9);
      player.setShip(0, "s", [0, 0]);
      expect(player.receiveAttack([0, 0])).toBe(true);
    });
    test("receiveAttack() is a miss", () => {
      const player = new AIPlayer(0, "red", 9);
      player.setShip(0, "s", [0, 0]);
      expect(player.receiveAttack([5, 5])).toBe(false);
    });
  });

  describe("setAllShips()", () => {
    test("successfully sets all ships", () => {
      const player = new AIPlayer(0, "red", 9);
      expect(player.setAllShips()).toEqual(true);
    });
  });

  describe("getMove()", () => {
    test("all tracked coords are ignored (board size: 2)", () => {
      const player = new AIPlayer(0, "red", 2);
      const boardSize = player._getBoard().size;
      for (let y = 0; y < boardSize; y++) {
        for (let x = 0; x < boardSize; x++) {
          if (y === 1 && x === 1) continue;
          player.updateTracker([x, y]);
        }
      }
      expect(player.getMove()).toEqual([1, 1]);
    });

    test("all tracked coords are ignored (board size: 9)", () => {
      const player = new AIPlayer(0, "red", 9);
      const boardSize = player._getBoard().size;
      for (let y = 0; y < boardSize; y++) {
        for (let x = 0; x < boardSize; x++) {
          if (y === 3 && x === 3) continue;
          player.updateTracker([x, y]);
        }
      }
      expect(player.getMove()).toEqual([3, 3]);
    });

    test("getMove only produces 4 results in a 2x2 board", () => {
      const player = new AIPlayer(0, "red", 2);
      player.updateTracker(player.getMove());
      player.updateTracker(player.getMove());
      player.updateTracker(player.getMove());
      player.updateTracker(player.getMove());
      expect(player.getMove()).toBe(false);
    });
  });
});
