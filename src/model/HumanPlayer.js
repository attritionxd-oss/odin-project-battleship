import Player from "./Player.js";

export default class HumanPlayer extends Player {
  constructor(id, color, size) {
    super(id, color, size);
  }

  getMove() {}
}
