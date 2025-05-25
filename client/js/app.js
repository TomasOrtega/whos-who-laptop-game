// client/js/app.js

/**
 * Immediately-Invoked Function Expression (IIFE)
 * that sets up the Who's Who game client logic.
 * @returns {void}
 */
(function () {
  /** 
   * Holds the current player's name: "Tomas" or "Nora".
   * @type {string|null}
   */
  let playerName = null;

  /**
   * Asynchronously creates (or resets) the 2-player game on the server.
   * @returns {Promise<void>} Resolves once the server confirms game creation.
   * @throws {Error} If the server response is not OK.
   */
  async function createNewGame() {
    const res = await fetch('/api/game/create', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to create 2-player game.');
    console.log('Created a new 2-player game.');
  }

  /**
   * Fetches and renders the board + mystery character for the currently chosen player.
   * @returns {Promise<void>} Resolves once the board/mystery data is fetched and rendered.
   */
  async function fetchAndRenderPlayerState() {
    if (!playerName) return;  // If no player selected yet, do nothing.

    try {
      const res = await fetch(`/api/game/state?playerName=${playerName}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch board for ${playerName}`);
      }
      const data = await res.json();

      // Render board and mystery via global "Game" object
      window.Game.renderGameBoard(playerName, data.board);
      window.Game.renderMysteryCharacter(data.mysteryCharacter);
    } catch (err) {
      console.error('Error loading state:', err);
      const container = document.getElementById('game-container');
      if (container) {
        container.textContent = `Error loading board for ${playerName}.`;
      }
    }
  }

  /**
   * Sets up the DOM once the page is fully loaded:
   *  1) Creates a new 2-player game on the server.
   *  2) Finds the player selection buttons.
   *  3) Listens for button clicks, sets the player, hides the buttons, and fetches their board.
   */
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