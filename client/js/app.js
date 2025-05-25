// client/js/app.js
(function() {
  let playerName = null;

  /**
   * Creates/Resets the 2-player game on the server.
   */
  async function createNewGame() {
    const res = await fetch('/api/game/create', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to create 2-player game.');
    console.log('Created a new 2-player game.');
  }

  /**
   * Fetch & render the board + mystery for the chosen player.
   */
  async function fetchAndRenderPlayerState() {
    if (!playerName) return;

    try {
      const res = await fetch(`/api/game/state?playerName=${playerName}`);
      if (!res.ok) throw new Error(`Failed to fetch board for ${playerName}`);
      const data = await res.json();

      window.Game.renderGameBoard(playerName, data.board);
      window.Game.renderMysteryCharacter(data.mysteryCharacter);
    } catch (err) {
      console.error('Error loading state:', err);
      const container = document.getElementById('game-container');
      if (container) container.textContent = `Error loading board for ${playerName}.`;
    }
  }

  document.addEventListener('DOMContentLoaded', async () => {
    // 1. Create/Reset the 2-player game up front
    await createNewGame();

    // 2. Grab references to the buttons & container
    const tomasButton = document.getElementById('tomas-button');
    const noraButton = document.getElementById('nora-button');
    const playerBtnContainer = document.getElementById('player-buttons');

    // 3. On button click, set the player, hide the buttons, and fetch that board
    tomasButton.addEventListener('click', () => {
      playerName = 'Tomas';
      // Hide the entire button container
      playerBtnContainer.style.display = 'none';
      fetchAndRenderPlayerState();
    });

    noraButton.addEventListener('click', () => {
      playerName = 'Nora';
      playerBtnContainer.style.display = 'none';
      fetchAndRenderPlayerState();
    });
  });
})();