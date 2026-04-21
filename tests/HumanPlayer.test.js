import Player from "../src/model/Player.js";
import HumanPlayer from "../src/model/HumanPlayer.js";

describe("HumanPlayer", () => {
  test("modulee exists and inherits from Object and Player", () => {
    expect(new HumanPlayer()).toBeInstanceOf(Object);
    expect(new HumanPlayer()).toBeInstanceOf(Player);
  });

  describe("methods require subclass implementation", () => {
    test.each([["setShip"], ["getMove"]])("player.%s is implemented", (fn) => {
      const player = new HumanPlayer();
      expect(() => player[fn]()).not.toThrow(/must be implemented by subclass/);
    });
  });

  describe("receiveAttack()", () => {
    test("receiveAttack() is a hit", () => {
      const player = new HumanPlayer(0, "red", 9);
      player.setShip(0, "s", [0, 0]);
      expect(player.receiveAttack([0, 0])).toBe(true);
    });
    test("receiveAttack() is a miss", () => {
      const player = new HumanPlayer(0, "red", 9);
      player.setShip(0, "s", [0, 0]);
      expect(player.receiveAttack([5, 5])).toBe(false);
    });
  });
});
