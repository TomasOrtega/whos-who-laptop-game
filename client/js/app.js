// client/js/app.js
(function() {
  async function fetchGameState() {
    try {
      const response = await fetch('/api/game/state');
      if (!response.ok) {
        throw new Error('Failed to fetch game state.');
      }
      const data = await response.json();
      window.Game.renderGameBoard(data);
    } catch (error) {
      console.error(error);
      const container = document.getElementById('game-container');
      container.textContent = 'Error loading game.';
    }
  }

  // Example: create a new game on page load, then fetch its state
  async function createGame() {
    try {
      const response = await fetch('/api/game/create', { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to create a new game.');
      }
      await fetchGameState();
    } catch (err) {
      console.error(err);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    createGame();
  });
})();