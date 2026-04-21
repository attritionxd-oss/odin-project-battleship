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
      this.gameRunner();
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

  gameRunner() {
    this.engine.initGame();
    this.engine.startGame();
    this.matchType = this.engine.gameState.matchType.join("-");

    if (this.matchType === "ai-ai") {
      this.aiGameRunner();
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

    gameboardContainer.innerHTML = `
      <div class="player-column p1-column">
        <h2>${this.engine.gameState.p1.name}</h2>
        <div class="grids-wrapper">
          <div class="grid-container"><span>Board</span>${p1BoardHtml}</div>
          <div class="grid-container"><span>Tracker</span>${this.#renderGrid(this.engine.getPlayerTracker("p1"), "tracker")}</div>
        </div>
      </div>

      <div class="player-column p2-column">
        <h2>${this.engine.gameState.p2.name}</h2>
        <div class="grids-wrapper">
          <div class="grid-container"><span>Board</span>${p2BoardHtml}</div>
          <div class="grid-container"><span>Tracker</span>${this.#renderGrid(this.engine.getPlayerTracker("p2"), "tracker")}</div>
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
}
