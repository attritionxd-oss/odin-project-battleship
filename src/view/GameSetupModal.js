const GameSetupModal = {
  render: () => {
    return `
      <div class="gamesetup-modal__wrapper">
        <form action="none">
          <p class="form-title">
            <button type="button" id="gamesetup-modal__close-modal-button">x</button>
          </p>

          <h3>Player 1</h3>
          <p>
            <label for="player1-name">Name</label>
            <input type="text" id="player1-name" placeholder="Player 1" required />
          </p>

          <p>
            <label for="player1-type">Type</label>
            <span class="pseudo-select">
              <button type="button" 
                class="gamesetup-modal__player1-type" 
                id="gamesetup-modal__player1-type-human" 
                data-value="human">Human</button>
                
              <button type="button" 
                class="gamesetup-modal__player1-type" 
                id="gamesetup-modal__player1-type-ai" 
                data-value="ai">
                AI
              </button>

              <input type="hidden" id="player1-type-selected-option" 
                name="selectedOption" value=""
              >
            </span>
          </p>

          <hr />

          <h3>Player 2</h3>
          <p>
            <label for="player2-name">Name</label>
            <input type="text" id="player2-name" placeholder="Player 2" required />
          </p>

          <p>
            <label for="player2-type">Type</label>
            <span class="pseudo-select">
              <button type="button" 
                class="gamesetup-modal__player2-type" 
                id="gamesetup-modal__player2-type-human" 
                data-value="human">Human</button>
                
              <button type="button" 
                class="gamesetup-modal__player2-type" 
                id="gamesetup-modal__player2-type-ai" 
                data-value="ai">
                AI
              </button>

              <input type="hidden" id="player2-type-selected-option" 
                name="selectedOption" value=""
              >
            </span>
          </p>

          <hr />

          <button type="button" class="gamesetup-modal__start-game-button submit">
            Start game
          </button>
        </form>
      </div>
    `;
  },
};

export default GameSetupModal;
//
// gamesetup-modal__banner
// gamesetup-modal__submit-wrapper
// gamesetup-modal__submit-button
// gamesetup-modal__h1
