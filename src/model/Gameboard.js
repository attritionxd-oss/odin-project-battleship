import Ship from "./Ship.js";

export default class Gameboard {
  #N_SHIPS = 5;
  #size;
  #board;
  #tracker;
  #ships;
  constructor(size = 7) {
    this.#setSize(size);
    this.#initBoard(size);
    this.#initTracker(size);
    this.#ships = this.#initShips();
  }

  #initShips() {
    const ships = [];
    for (let i = 0; i < this.#N_SHIPS; i++) {
      ships.push(new Ship(i));
    }
    return ships;
  }

  #createBoard(size) {
    return Array.from({ length: size }, () => Array(size));
  }

  getBoard() {
    return this.#board;
  }

  #initBoard(size) {
    this.#board = this.#createBoard(size);
  }

  #updateBoard([x, y], id) {
    this.#board[x][y] = id;
  }

  get tracker() {
    return this.#tracker;
  }

  #initTracker(size) {
    this.#tracker = this.#createBoard(size);
  }

  get ships() {
    return this.#ships;
  }

  get size() {
    return this.#size;
  }

  #setSize(size) {
    this.#size = size;
  }

  positionShip(id, direction, [posX, posY]) {
    const ship = this.#ships[id];
    if (!ship) {
      console.error("Arg: `id` not found");
      return;
    }
    if (!["n", "e", "w", "s"].includes(direction)) {
      console.error("Arg: `direction` invalid");
      return;
    }
    if (posX < 0 || posX > this.#size || posY < 0 || posY > this.#size) {
      console.error("Arg: `posX`, `posY` invalid");
      return;
    }
    const shipLen = ship.size;
    const offset = direction === "n" || direction === "w" ? -1 : 1;
    const xStep = direction === "w" || direction === "e" ? offset : 0;
    const yStep = direction === "n" || direction === "s" ? offset : 0;

    const plannedCoords = [];

    for (let i = 0; i < shipLen; i++) {
      plannedCoords.push({
        x: posX + i * xStep,
        y: posY + i * yStep,
      });
    }

    const isOutOfBounds = plannedCoords.some(
      (coord) =>
        coord.x < 0 ||
        coord.x >= this.size ||
        coord.y < 0 ||
        coord.y >= this.size,
    );

    if (isOutOfBounds) {
      console.error("Position out-of-bounds: Placement aborted.");
      return;
    }

    plannedCoords.forEach((coord) => {
      ship.posX.push(coord.x);
      ship.posY.push(coord.y);
      this.#updateBoard([coord.x, coord.y], id);
    });
  }

  receiveAttack([posX, posY]) {
    const shipId = this.getBoard()[posX][posY];
    const ship = this.#ships[shipId];
    if (!ship) return false;
    ship.hit();
    return true;
  }

  nPositionedShips() {
    const ships = this.#ships
      .map((ship) => ship.posX.length !== 0 && ship.posY.length !== 0)
      .filter((isPositioned) => isPositioned);
    return ships.length;
  }

  allShipsPositioned() {
    return this.nPositionedShips() === this.#N_SHIPS;
  }

  nLiveShips() {
    const liveShips = this.#ships
      .map((ship) => !ship.isSunk())
      .filter((isLive) => isLive);
    return liveShips.length;
  }

  allShipsSunk() {
    return this.nLiveShips() === 0;
  }
}
