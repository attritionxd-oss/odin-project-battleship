import Player from "./Player.js";

export default class HumanPlayer extends Player {
  constructor(id, color, size) {
    super(id, color, size);
  }

  setShip(id, direction, [posX, posY]) {
    this._getBoard().positionShip(id, direction, [posX, posY]);
  }

  getMove() {}
}
