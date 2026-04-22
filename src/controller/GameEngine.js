import HumanPlayer from "/src/model/HumanPlayer.js";
import AIPlayer from "/src/model/AIPlayer.js";

export default class GameEngine {
  constructor() {
    this.gameState = {
      currentTurn: undefined,
      matchType: [],
      gameReady: false,
      gameCommenced: false,
      gameOver: false,
    };
  }

  setup(setupData) {
    this.setupData = setupData;
    const p1 = setupData.p1;
    const p2 = setupData.p2;

    const p1data =
      setupData.p1.type === "human"
        ? new HumanPlayer(p1.id, p1.color, p1.size)
        : new AIPlayer(p1.id, p1.color, p1.size);

    const p2data =
      setupData.p2.type === "human"
        ? new HumanPlayer(p2.id, p2.color, p2.size)
        : new AIPlayer(p2.id, p2.color, p2.size);

    this.gameState["p1"] = {
      id: "p1",
      name: setupData.p1.name,
      playerType: setupData.p1.type,
      data: p1data,
    };
    this.gameState["p2"] = {
      id: "p2",
      name: setupData.p2.name,
      playerType: setupData.p2.type,
      data: p2data,
    };
  }

  initGame() {
    for (const player in this.setupData) {
      if (!Object.hasOwn(this.setupData, player)) continue;

      const playerType = this.setupData[player].type;
      if (playerType === "ai") {
        this.aiPlayerInit(player);
      }
      this.gameState.matchType.push(playerType);
    }
    this.gameState.currentTurn = "p1";
    this.gameState.gameReady = true;
  }

  startGame() {
    this.gameState.gameCommenced = true;
  }

  getPlayerBoard(playerId) {
    return this.gameState[playerId].data._getBoard().getBoard();
  }

  getPlayerTracker(playerId) {
    return this.gameState[playerId].data._getBoard().tracker;
  }

  aiPlayerInit(playerId) {
    return this.gameState[playerId].data.setAllShips();
  }

  playerIsReady(playerId) {
    return this.gameState[playerId].data.isReady();
  }

  playerHasLost(playerId) {
    return this.gameState[playerId].data.hasLost();
  }

  getPlayerMove(playerId) {
    return this.gameState[playerId].data.getMove();
  }
}
