import Layout from "/src/view/Layout.js";
import WelcomeModal from "/src/view/WelcomeModal.js";
import GameSetupModal from "/src/view/GameSetupModal.js";

export default class App {
  constructor(gameEngine) {
    this.root = document.querySelector("#root");
    this.renderLayout();
    this.renderWelcomeModal();
    this.renderGameSetupModal();
    this.gameSetupModalDefaultOptions();
    this.engine = gameEngine;
    this.selectedShipId = null;
    this.selectedDir = null;
  }

  renderLayout() {
    this.root.innerHTML = Layout.render();
    this.header = document.querySelector("header");
    this.main = document.querySelector("main#app-content");
    this.footer = document.querySelector("footer");
  }

  renderWelcomeModal() {
    this.welcomeModal = document.createElement("div");
    this.welcomeModal.classList.add("welcome-modal");
    this.welcomeModal.innerHTML = WelcomeModal.render();
    this.main.appendChild(this.welcomeModal);
    this.toggleVisibility(this.welcomeModal, true);
  }

  renderGameSetupModal() {
    this.gameSetup = document.createElement("div");
    this.gameSetup.classList.add("gamesetup-modal");
    this.gameSetup.innerHTML = GameSetupModal.render();

    this.main.appendChild(this.gameSetup);
    this.toggleVisibility(this.gameSetup);
  }

  gameSetupModalDefaultOptions() {
    const defaultValue = "ai";
    this.p1InputVal = document.querySelector("#player1-type-selected-option");
    this.p2InputVal = document.querySelector("#player2-type-selected-option");

    this.p1InputVal.value = defaultValue;
    const defaultP1Btn = document.querySelector(
      `.gamesetup-modal__player1-type[data-value=${defaultValue}]`,
    );
    if (defaultP1Btn) {
      this.toggleHighlight(defaultP1Btn, "clicked", true);
    }

    this.p2InputVal.value = defaultValue;
    const defaultP2Btn = document.querySelector(
      `.gamesetup-modal__player2-type[data-value=${defaultValue}]`,
    );
    if (defaultP2Btn) {
      this.toggleHighlight(defaultP2Btn, "clicked", true);
    }
  }

  toggleVisibility(element, isVisible) {
    if (isVisible) {
      element.classList.remove("hidden");
      element.classList.add("visible");
    } else {
      element.classList.add("hidden");
      element.classList.remove("visible");
    }
  }

  toggleHighlight(button, className, forceState) {
    if (forceState === true) {
      button.classList.add(className);
      return;
    }
    if (forceState === false) {
      button.classList.remove(className);
      return;
    }
    button.classList.toggle(className);
  }

  playerTypeButtonEventListeners() {
    const p1type = document.querySelectorAll(".gamesetup-modal__player1-type");
    const p2type = document.querySelectorAll(".gamesetup-modal__player2-type");
    p1type.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();

        const selectedValue = button.getAttribute("data-value");
        this.p1InputVal.value = selectedValue;

        p1type.forEach((btn) => this.toggleHighlight(btn, "clicked", false));
        this.toggleHighlight(button, "clicked");
      });
    });
    p2type.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();

        const selectedValue = button.getAttribute("data-value");
        this.p2InputVal.value = selectedValue;

        p2type.forEach((btn) => this.toggleHighlight(btn, "clicked", false));
        this.toggleHighlight(button, "clicked");
      });
    });
  }

  gameSetupStartBtnEventListener() {
    this.startGameBtn = document.querySelector(
      ".gamesetup-modal__start-game-button",
    );
    this.startGameBtn.addEventListener("click", () => {
      const p1Input = document.querySelector("input#player1-name");
      const p2Input = document.querySelector("input#player2-name");

      const setupData = {
        p1: {
          name: p1Input.value === "" ? p1Input.placeholder : p1Input.value,
          color: "red",
          boardSize: 7,
          type: document.querySelector("input#player1-type-selected-option")
            .value,
        },
        p2: {
          name: p2Input.value === "" ? p2Input.placeholder : p2Input.value,
          color: "blue",
          boardSize: 7,
          type: document.querySelector("input#player2-type-selected-option")
            .value,
        },
      };
      this.toggleVisibility(this.gameSetup);
      this.engine.setup(setupData);
      this.initPreGamePhase();
    });
  }

  initEventListeners() {
    this.launchSetupBtn = document.querySelector(
      ".welcome-modal__launch-setup-button",
    );
    this.launchSetupBtn.addEventListener("click", () => {
      this.toggleVisibility(this.welcomeModal);
      this.toggleVisibility(this.gameSetup, true);
    });

    const closeSetupModal = document.querySelector(
      "#gamesetup-modal__close-modal-button",
    );
    closeSetupModal.addEventListener("click", () => {
      this.toggleVisibility(this.gameSetup);
      this.toggleVisibility(this.welcomeModal, true);
    });

    this.playerTypeButtonEventListeners();

    this.gameSetupStartBtnEventListener();
  }

  #renderGrid(data, type, opponentTracker) {
    return `
        <table class="game-grid game-grid--${type}">
          ${data
            .map(
              (row, y) => `
            <tr>
              ${row
                .map((cell, x) => {
                  let content = "&nbsp;";
                  let cellClass = "";

                  if (type === "tracker") {
                    if (cell === true) {
                      content = "💥";
                      cellClass = "hit";
                    }
                    if (cell === false) {
                      content = "O";
                      cellClass = "miss";
                    }
                  } else {
                    content = cell !== undefined ? `S${cell}` : "&nbsp;";
                    if (cell !== undefined) cellClass = "ship";

                    if (opponentTracker && opponentTracker[y][x] === true) {
                      cellClass += " hit";
                    }
                  }

                  return `<td class="${cellClass}">${content}</td>`;
                })
                .join("")}
            </tr>
          `,
            )
            .join("")}
        </table>
      `;
  }

  initPreGamePhase() {
    this.engine.initGame();

    const p1 = this.engine.gameState.p1;
    const p2 = this.engine.gameState.p2;

    if (p1.playerType === "human" && !p1.data.isReady()) {
      this.renderSplashScreen(
        `${p1.name}, place your ships`,
        "Start Setup",
        () => this.renderShipSetup("p1"),
      );
    } else if (p2.playerType === "human" && !p2.data.isReady()) {
      this.renderSplashScreen(
        `${p2.name}, place your ships`,
        "Start Setup",
        () => this.renderShipSetup("p2"),
      );
    } else {
      this.proceedToBattle();
    }
  }

  proceedToBattle() {
    this.engine.startGame();
    this.matchType = this.engine.gameState.matchType.join("-");

    if (this.matchType === "ai-ai") {
      this.aiGameRunner();
    } else {
      this.activeGameRunner();
    }
  }

  aiBoardRender() {
    const oldBoard = document.querySelector(".gameboard-ai-ai");
    if (oldBoard) oldBoard.remove();

    const gameboardContainer = document.createElement("div");
    gameboardContainer.classList.add("gameboard-ai-ai");

    const tracker1 = this.engine.getPlayerTracker("p1");
    const tracker2 = this.engine.getPlayerTracker("p2");
    const p1BoardHtml = this.#renderGrid(
      this.engine.getPlayerBoard("p1"),
      "board",
      tracker2,
    );
    const p2BoardHtml = this.#renderGrid(
      this.engine.getPlayerBoard("p2"),
      "board",
      tracker1,
    );
    const p1TrackerHtml = this.#renderGrid(
      this.engine.getPlayerTracker("p1"),
      "tracker",
    );
    const p2TrackerHtml = this.#renderGrid(
      this.engine.getPlayerTracker("p2"),
      "tracker",
    );

    gameboardContainer.innerHTML = `
      <div class="player-column p1-column">
        <h2>${this.engine.gameState.p1.name}</h2>
        <div class="grids-wrapper">
          <div class="grid-container"><span>Board</span>${p1BoardHtml}</div>
          <div class="grid-container"><span>Tracker</span>${p1TrackerHtml}</div>
        </div>
      </div>

      <div class="player-column p2-column">
        <h2>${this.engine.gameState.p2.name}</h2>
        <div class="grids-wrapper">
          <div class="grid-container"><span>Board</span>${p2BoardHtml}</div>
          <div class="grid-container"><span>Tracker</span>${p2TrackerHtml}</div>
        </div>
      </div>
    `;

    this.main.appendChild(gameboardContainer);
    this.toggleVisibility(gameboardContainer, true);
  }

  aiGameRunner() {
    const gameInterval = setInterval(() => {
      const currentId = this.engine.gameState.currentTurn;
      const opponentId = currentId === "p1" ? "p2" : "p1";

      const coords = this.engine.getPlayerMove(currentId);
      if (!coords) {
        clearInterval(gameInterval);
        return;
      }

      const isHit =
        this.engine.gameState[opponentId].data.receiveAttack(coords);

      this.engine.gameState[currentId].data.updateTracker(coords, isHit);

      this.aiBoardRender();

      if (this.engine.playerHasLost(opponentId)) {
        this.engine.gameState.gameOver = true;
        alert(`${this.engine.gameState[currentId].name} Wins!`);
        clearInterval(gameInterval);
      }

      this.engine.gameState.currentTurn = opponentId;
    }, 300);
  }

  renderSplashScreen(message, buttonText, onConfirm) {
    const splash = document.createElement("div");
    splash.classList.add("splash-screen"); // Add styles for centering/overlay

    splash.innerHTML = `
      <div class="splash-content">
        <h1>${message}</h1>
        <button class="splash-confirm-btn">${buttonText}</button>
      </div>
    `;

    this.main.appendChild(splash);

    splash
      .querySelector(".splash-confirm-btn")
      .addEventListener("click", () => {
        splash.remove();
        onConfirm();
      });
  }

  renderShipSetup(playerId) {
    const board = this.engine.getPlayerBoard(playerId);
    const ships = this.engine.gameState[playerId].data._getBoard().ships;

    if (this.selectedShipId === null || ships[this.selectedShipId].isSet) {
      const nextShip = ships.find((s) => !s.isSet);
      this.selectedShipId = nextShip ? ships.indexOf(nextShip) : null;
    }

    let modal = document.querySelector(".boardsetup-modal--interactive");
    if (!modal) {
      modal = document.createElement("div");
      modal.classList.add("boardsetup-modal", "boardsetup-modal--interactive");
      this.main.appendChild(modal);
    }
    modal.innerHTML = "";

    const setupContainer = document.createElement("div");
    setupContainer.classList.add("setup-container");

    const renderInteractiveBoard = (data) => {
      return `
        <table class="setup-board">
          ${data
            .map(
              (row, y) => `
            <tr>
              ${row
                .map(
                  (cell, x) => `
                <td class="setup-cell ${cell !== undefined ? "placed" : ""}" 
                    data-x="${x}" data-y="${y}">
                  ${cell !== undefined ? "S" : "&nbsp;"}
                </td>
              `,
                )
                .join("")}
            </tr>
          `,
            )
            .join("")}
        </table>
      `;
    };

    const renderShipControls = (shipList) => {
      return `
      <div class="setup-controls">
        <h3>Select Ship</h3>
        <div class="ship-buttons">
          ${shipList
            .map(
              (ship, idx) => `
            <button class="ship-select-btn ${ship.isSet ? "hidden" : ""} ${this.selectedShipId === idx ? "active" : ""}" data-id="${idx}">
              ${ship.className} (${ship.size})
            </button>
          `,
            )
            .join("")}
        </div>
        <h3>Orientation</h3>
        <div class="direction-buttons">
          ${["n", "e", "w", "s"]
            .map(
              (dir) => `
            <button class="dir-btn ${this.selectedDir === dir ? "active" : ""}" data-dir="${dir}">${dir.toUpperCase()}</button>
          `,
            )
            .join("")}
        </div>
        <div class="control-buttons">
          <button class="ready-btn disabled">Ready</button>
          <button class="reset-btn">Reset</button>
        </div>
      </div>
    `;
    };

    setupContainer.innerHTML = `
      <div class="setup-board-wrapper">
        ${renderInteractiveBoard(board)}
      </div>
      ${renderShipControls(ships)}
    `;

    modal.appendChild(setupContainer);
    this.attachSetupEventListeners(playerId);

    const isPlayerReady = this.engine.gameState[playerId].data.isReady();
    const readyBtn = modal.querySelector(".ready-btn");

    if (isPlayerReady) {
      readyBtn.classList.remove("disabled");
      readyBtn.addEventListener("click", () => {
        this.handleSetupCompletion(playerId);
      });
    }
  }

  attachSetupEventListeners(playerId) {
    const modal = document.querySelector(".boardsetup-modal--interactive");

    modal.querySelectorAll(".ship-select-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.selectedShipId = parseInt(btn.dataset.id);
        this.renderShipSetup(playerId);
      });
    });

    modal.querySelectorAll(".dir-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.selectedDir = btn.dataset.dir;
        this.renderShipSetup(playerId);
      });
    });

    modal.querySelector(".setup-board").addEventListener("click", (e) => {
      const cell = e.target.closest(".setup-cell");
      if (!cell || this.selectedShipId === null || this.selectedDir === null)
        return;

      const x = parseInt(cell.dataset.x);
      const y = parseInt(cell.dataset.y);

      const success = this.engine.gameState[playerId].data.setShip(
        this.selectedShipId,
        this.selectedDir,
        [x, y],
      );

      if (success) {
        this.renderShipSetup(playerId);
      } else {
        alert("Invalid Placement! Out of bounds or overlapping.");
      }
    });

    modal.querySelector(".reset-btn").addEventListener("click", () => {
      this.engine.gameState[playerId].data.reset(); // Wipe the data
      this.renderShipSetup(playerId); // Wipe the view
    });
  }

  handleSetupCompletion(playerId) {
    const player = this.engine.gameState[playerId].data;

    if (!player.isReady()) {
      console.error("Attempted to finalize setup, unpositioned ships remain");
      return;
    }

    const modal = document.querySelector(".boardsetup-modal");
    if (modal) {
      modal.remove();
    }

    const opponentId = playerId === "p1" ? "p2" : "p1";
    const opponentEntry = this.engine.gameState[opponentId];
    const opponentData = opponentEntry.data;
    const opponentType = opponentEntry.playerType;
    const opponentName = opponentEntry.name;

    if (opponentType === "human" && !opponentData.isReady()) {
      this.renderSplashScreen(
        `Pass the device to ${opponentName}`,
        "Start Setup",
        () => this.renderShipSetup(opponentId),
      );
    } else {
      this.renderSplashScreen(
        "All fleets deployed. Prepare for battle!",
        "Commence attack",
        () => this.proceedToBattle(),
      );
    }
  }

  activeGameRunner() {
    console.debug("activeGameRunner");
  }
}
