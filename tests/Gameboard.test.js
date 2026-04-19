import Gameboard from "/src/model/Gameboard";

describe("Gameboard", () => {
  test("modulee exists and returns an object", () => {
    expect(() => new Gameboard()).toBeInstanceOf(Object);
  });

  test.each([["receiveAttack"], ["positionShip"], ["nLiveShips"]])(
    "board.%s is a function",
    (fn) => {
      const board = new Gameboard("Carrier");
      expect(board[fn]).toBeInstanceOf(Function);
    },
  );

  describe("constructor creates board and ships", () => {
    test.each([
      [undefined, 7, 5],
      [5, 5, 5],
    ])(
      "new Gameboard(%i) sets board with size %i and %i ships",
      (size, boardSize, nShips) => {
        const board = new Gameboard(size);

        expect(board.getBoard().length).toBe(boardSize);

        expect(board.getBoard()).toEqual(
          expect.arrayContaining(
            Array.from({ length: boardSize }, () => Array(boardSize)),
          ),
        );

        expect(board.tracker.length).toBe(boardSize);

        expect(board.tracker).toEqual(
          expect.arrayContaining(
            Array.from({ length: boardSize }, () => Array(boardSize)),
          ),
        );

        expect(board.ships.length).toBe(nShips);

        expect(board.ships[0].isSet).toBe(false);
      },
    );
  });

  describe("positionShip()", () => {
    describe("successful ship positioning", () => {
      test.each([
        [0, "n", 5, 5],
        [4, "w", 3, 3],
        [3, "n", 6, 6],
        [0, "n", 6, 6],
      ])(
        "positionShip(%i, %s, [%i, %i]) successfull",
        (shipId, direction, x, y) => {
          const board = new Gameboard();
          expect(board.positionShip(shipId, direction, [x, y])).toBe(true);
          expect(board.ships[shipId].posX[0]).toBe(x);
          expect(board.ships[shipId].posY[0]).toBe(y);
          expect(board.getBoard()[y][x]).toBe(shipId);
          expect(board.ships[shipId].isSet).toBe(true);
        },
      );
    });

    describe("erroneous arg handling", () => {
      describe("missing args fails and logs", () => {
        test.each([
          [undefined, "n", 0, 0],
          [5, "n", 0, 0],
          [1, "a", 0, 0],
        ])(
          "positionShip(%i, %s, [%i, %i] incorrect arg handling",
          (shipId, direction, x, y) => {
            const board = new Gameboard();
            const consoleSpy = jest
              .spyOn(console, "error")
              .mockImplementation(() => {});
            expect(board.positionShip(shipId, direction, [x, y])).toBe(false);
            expect(consoleSpy).toHaveBeenCalled();
          },
        );
      });

      test.each([
        [0, "s", 5, 5],
        [4, "e", 6, 6],
        [3, "n", 0, 0],
      ])("positionShip(%i, %s, [%i, %i]) fails", (shipId, direction, x, y) => {
        const board = new Gameboard();
        const consoleSpy = jest
          .spyOn(console, "error")
          .mockImplementation(() => {});
        expect(board.positionShip(shipId, direction, [x, y])).toBe(false);
        expect(consoleSpy).toHaveBeenCalled();
        expect(board.ships[shipId].posX[0]).toBeUndefined();
        expect(board.ships[shipId].posY[0]).toBeUndefined();
        expect(board.getBoard()[y][x]).toBeUndefined();
      });
    });
  });

  describe("receiveAttack()", () => {
    test.each([
      [0, 3, 1],
      [0, 2, 1],
      [0, 1, 1],
    ])("receiveAttack([%i, %i]) results in ship damage %i", (x, y, dmg) => {
      const board = new Gameboard();
      board.positionShip(0, "s", [0, 0]);
      expect(board.getBoard()[0][0]).toBe(0);
      expect(board.getBoard()[1][0]).toBe(0);
      expect(board.getBoard()[2][0]).toBe(0);
      expect(board.getBoard()[3][0]).toBe(0);
      board.receiveAttack([x, y]);
      expect(board.ships[0].damage).toBe(dmg);
    });

    test.each([
      [5, 4],
      [3, 3],
      [6, 6],
    ])("receiveAttack([%i, %i]) does not hit", (x, y) => {
      const board = new Gameboard();
      board.positionShip(0, "s", [0, 0]);
      expect(board.getBoard()[0][0]).toBe(0);
      board.receiveAttack([x, y]);
      expect(board.ships[0].damage).toBe(0);
    });
  });

  describe("nPositionedShips() and allShipsPositioned()", () => {
    const board = new Gameboard();
    test("0 positioned ships", () => {
      expect(board.nPositionedShips()).toBe(0);
      expect(board.allShipsPositioned()).toBe(false);
    });
    test("1 positioned ship", () => {
      board.positionShip(0, "s", [0, 0]);
      expect(board.nPositionedShips()).toBe(1);
      expect(board.allShipsPositioned()).toBe(false);
    });
    test("5 positioned ships", () => {
      board.positionShip(1, "s", [1, 0]);
      board.positionShip(2, "s", [2, 0]);
      board.positionShip(3, "s", [3, 0]);
      board.positionShip(4, "s", [4, 0]);
      expect(board.nPositionedShips()).toBe(5);
      expect(board.allShipsPositioned()).toBe(true);
    });
  });

  describe("nLiveShips() and allShipsLive()", () => {
    const board = new Gameboard();
    test("all ships live", () => {
      expect(board.nLiveShips()).toBe(5);
      expect(board.allShipsSunk()).toBe(false);
    });
    test("4 ships remain", () => {
      board.positionShip(4, "e", [0, 0]);
      board.receiveAttack([0, 0]);
      board.receiveAttack([1, 0]);
      expect(board.nLiveShips()).toBe(4);
      expect(board.allShipsSunk()).toBe(false);
    });

    test("0 ships remain", () => {
      board.positionShip(3, "e", [0, 1]);
      board.receiveAttack([0, 1]);
      board.receiveAttack([1, 1]);
      board.receiveAttack([2, 1]);
      expect(board.nLiveShips()).toBe(3);

      board.positionShip(2, "e", [0, 2]);
      board.receiveAttack([0, 2]);
      board.receiveAttack([1, 2]);
      board.receiveAttack([2, 2]);
      board.receiveAttack([3, 2]);
      expect(board.nLiveShips()).toBe(2);

      board.positionShip(1, "e", [0, 3]);
      board.receiveAttack([0, 3]);
      board.receiveAttack([1, 3]);
      board.receiveAttack([2, 3]);
      board.receiveAttack([3, 3]);
      board.receiveAttack([4, 3]);
      expect(board.ships.map((ship) => ship.isSunk())).toEqual(
        JSON.parse("[false,true,true,true,true]"),
      );
      expect(board.nLiveShips()).toBe(1);

      board.positionShip(0, "e", [0, 4]);
      board.receiveAttack([0, 4]);
      board.receiveAttack([1, 4]);
      board.receiveAttack([2, 4]);
      board.receiveAttack([3, 4]);
      board.receiveAttack([4, 4]);
      board.receiveAttack([5, 4]);
      expect(board.nLiveShips()).toBe(0);

      expect(board.allShipsSunk()).toBe(true);
      expect(board.ships.map((ship) => ship.isSunk())).toEqual(
        JSON.parse("[true,true,true,true,true]"),
      );
    });
  });
});
