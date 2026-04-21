import Gameboard from "./Gameboard.js";

export default class Player {
  #isActive;
  #id;
  #color;
  #readyState;
  #board;
  constructor(id, color, size) {
    this.#setIsActive(false);
    this.#setId(id);
    this.#setColor(color);
    this.#readyState = false;
    this.#board = new Gameboard(size);
  }

  get isActive() {
    return this.#isActive;
  }

  #setIsActive(status) {
    this.#isActive = status;
  }

  get id() {
    return this.#id;
  }

  #setId(id) {
    this.#id = id;
  }

  get color() {
    return this.#color;
  }

  #setColor(value) {
    this.#color = value;
  }

  get readyState() {
    return this.#readyState;
  }

  #setReadyState(state) {
    this.#readyState = state;
  }

  _getBoard() {
    return this.#board;
  }

  isReady() {
    const board = this._getBoard();
    if (board.allShipsPositioned()) {
      this.#setReadyState(true);
      return true;
    }
    return false;
  }

  hasLost() {
    return this._getBoard().allShipsSunk();
  }

  getTracker() {
    return this._getBoard().tracker;
  }

  receiveAttack([x, y]) {
    return this.#board.receiveAttack([x, y]);
  }

  updateTracker([x, y], isHit = false) {
    this._getBoard().tracker[y][x] = isHit;
  }

  setShip() {
    throw new Error("setShip() must be implemented by subclass");
  }

  getMove() {
    throw new Error("getMove() must be implemented by subclass");
  }
}
