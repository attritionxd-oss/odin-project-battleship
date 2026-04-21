import "./styles/style-vars.css";
import "./styles/style.css";
import "./styles/style-welcome-modal.css";
import "./styles/style-game-setup-modal.css";
import "./styles/style-gameboard.css";
import "./styles/style-board-setup-modal.css";
import "./styles/style-splash-screen.css";

import App from "./controller/App.js";
import GameEngine from "./controller/GameEngine.js";

function bootstrap() {
  const gameEngine = new GameEngine();
  const app = new App(gameEngine);
  app.initEventListeners();
}

bootstrap();
