// client/js/game.js
window.Game = (function() {
  /**
   * Renders the game board from the current gameState.
   * @param {Object} gameState
   */
  function renderGameBoard(gameState) {
    const container = document.getElementById('game-container');
    container.innerHTML = '';

    if (!gameState || !gameState.board) {
      container.textContent = 'No active game board.';
      return;
    }

    const boardDiv = document.createElement('div');
    boardDiv.classList.add('game-board');

    gameState.board.forEach((charObj) => {
      const cardDiv = document.createElement('div');
      cardDiv.classList.add('card');

      if (charObj && charObj.name) {
        cardDiv.textContent = charObj.name;
        // Example: show an image if available
        // const img = document.createElement('img');
        // img.src = charObj.image;
        // cardDiv.appendChild(img);
      } else {
        cardDiv.textContent = 'Unknown Character';
      }

      boardDiv.appendChild(cardDiv);
    });

    container.appendChild(boardDiv);
  }

  return {
    renderGameBoard
  };
})();