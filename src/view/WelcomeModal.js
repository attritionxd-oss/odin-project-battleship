const WelcomeModal = {
  render: () => {
    return `
      <div class="welcome-modal__wrapper">
        <div class="welcome-modal__banner"></div>
        <h1 class="welcome-modal__h1">Welcome to Battleship</h1>
        <p>Press GO to start the game</p>
        <button class="welcome-modal__launch-setup-button">GO</button>
      </div>
    `;
  },
};

export default WelcomeModal;
