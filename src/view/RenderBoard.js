const RenderBoard = {
  render: () => {
    return `
      <div class="gameboard-player__wrapper">
        <table class="gameboard-player__board"></table>
        <ul class="gameboard-player__data></ul>
        <table class="gameboard-player__tracker"></table>
      </div>
    `;
  },
};

export default RenderBoard;
