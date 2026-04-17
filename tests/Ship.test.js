import Ship from "/src/model/Ship";

describe("Ship", () => {
  test("modulee exists and returns an object", () => {
    expect(() => new Ship()).toBeInstanceOf(Object);
  });

  test.each([["hit"], ["isSunk"]])(".%s exists", (fn) => {
    const ship = new Ship(0);
    expect(ship[fn]).toBeInstanceOf(Function);
  });

  describe("constructor sets expected property values", () => {
    test.each([
      [4, 2],
      [0, 5],
    ])("new Ship(%s) to have size %i", (id, returnedSize) => {
      const ship = new Ship(id);
      expect(ship.size).toBe(returnedSize);
    });
  });

  describe("constructor erroneous arg throws error", () => {
    test.each([undefined, -1, 6, "A"])(
      "new Ship(%s) to have size undefined",
      (id) => {
        expect(() => new Ship(id)).toThrow();
      },
    );
  });

  describe("hit()", () => {
    const ship = new Ship(4);
    test("expected properties", () => {
      expect(ship.size).toBe(2);
      expect(ship.damage).toBe(0);
    });

    test("hit increases damage", () => {
      ship.hit();
      expect(ship.damage).toBe(1);
    });

    test("damage out-of-bounds throws", () => {
      ship.hit();
      expect(ship.damage).toBe(2);
      expect(() => ship.hit()).toThrow();
    });
  });

  describe("isSunk()", () => {
    test("size == 2, isSunk() only returns true after 2 hits", () => {
      const ship = new Ship(4);
      ship.hit();
      ship.hit();
      expect(ship.isSunk()).toBe(true);
    });
    test("size == 3, isSunk() only returns true after 3 hits", () => {
      const ship = new Ship(2);
      ship.hit();
      ship.hit();
      ship.hit();
      expect(ship.isSunk()).toBe(true);
    });
  });
});
