import Player from "./Player.js";

export default class AIPlayer extends Player {
  constructor(id, color, size) {
    super(id, color, size);
  }

  setShip(id, direction, [posX, posY]) {
    return this._getBoard().positionShip(id, direction, [posX, posY]);
  }

  setAllShips() {
    const board = this._getBoard();
    const ships = board.ships;
    const dir = ["n", "e", "w", "s"];

    ships.forEach((_, idx) => {
      let placed = false;

      while (!placed) {
        const max = board.size;
        const posX = Math.floor(Math.random() * max);
        const posY = Math.floor(Math.random() * max);
        const randDir = dir[Math.floor(Math.random() * dir.length)];

        if (this.setShip(idx, randDir, [posX, posY])) {
          placed = true;
        }
      }
    });
    return true;
  }

  getMove() {
    const tracker = this._getBoard().tracker;
    const max = this._getBoard().size;
    const availableMoves = [];

    for (let y = 0; y < max; y++) {
      for (let x = 0; x < max; x++) {
        if (tracker[y][x] === undefined) availableMoves.push([x, y]);
      }
    }

    if (availableMoves.length === 0) return false;

    const randomIdx = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIdx];
  }
}
