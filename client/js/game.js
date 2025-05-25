// client/js/game.js

/**
 * The Game module exposes functions to render the board and the mystery character.
 * @module Game
 */
window.Game = (function () {
  /**
   * The currently active player's name. Used when toggling the board UI.
   * @type {string|null}
   */
  let currentPlayerName = null;

  /**
   * Asynchronously fetches the current player's state from the server,
   * then re-renders the updated board and mystery character.
   * @returns {Promise<void>} A promise resolved once the board is fetched and rendered.
   * @throws {Error} If the request fails or the server response is not OK.
   */
  async function refetchAndRenderBoard() {
    if (!currentPlayerName) return;

    try {
      const res = await fetch(`/api/game/state?playerName=${currentPlayerName}`);
      if (!res.ok) {
        throw new Error('Failed to fetch player state after move.');
      }
      const data = await res.json();

      // Render the board and the mystery character
      renderGameBoard(currentPlayerName, data.board);
      renderMysteryCharacter(data.mysteryCharacter);
    } catch (err) {
      console.error(err);
      const container = document.getElementById('game-container');
      if (container) container.textContent = 'Error updating board state.';
    }
  }

  /**
   * Renders the game board UI for the specified player.
   * - Displays a list of character cards.
   * - Clicking a card toggles its "isGrayedOut" state on the server, then re-fetches the board.
   * @param {string} playerName - The name of the current player ("Tomas" or "Nora").
   * @param {Array<Object>} board - The array of character objects to render.
   * @returns {void}
   */
  function renderGameBoard(playerName, board) {
    currentPlayerName = playerName;
    const container = document.getElementById('game-container');
    container.innerHTML = '';

    if (!board || board.length === 0) {
      container.textContent = `No characters found for ${playerName}.`;
      return;
    }

    board.forEach((charObj) => {
      const cardDiv = document.createElement('div');
      cardDiv.classList.add('card');

      // Display name text
      const nameEl = document.createElement('p');
      nameEl.textContent = charObj.name;
      cardDiv.appendChild(nameEl);

      // Display character image (if available)
      if (charObj.image) {
        const img = document.createElement('img');
        img.src = charObj.image;
        cardDiv.appendChild(img);
      }

      // Apply gray background if isGrayedOut is true
      if (charObj.isGrayedOut) {
        cardDiv.style.backgroundColor = 'gray';
      }

      // On card click, send a move request to the server to flip the gray-out state
      cardDiv.addEventListener('click', async () => {
        try {
          const response = await fetch('/api/game/move', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playerName, characterId: charObj.id })
          });
          const result = await response.json();
          console.log(result.message || result.error);

          // Re-fetch the entire board so the UI updates
          await refetchAndRenderBoard();
        } catch (error) {
          console.error('Move error', error);
        }
      });

      container.appendChild(cardDiv);
    });
  }

  /**
   * Renders the mystery character for the current player.
   * The mystery character is chosen from the *other* player's board.
   * @param {Object} mystery - The mystery character object with "name" and optional "image" properties.
   * @returns {void}
   */
  function renderMysteryCharacter(mystery) {
    const mysteryContainer = document.getElementById('mystery-container');
    mysteryContainer.innerHTML = '<h4>Mystery Character</h4>';

    if (!mystery || !mystery.name) {
      const p = document.createElement('p');
      p.textContent = 'No mystery assigned yet.';
      mysteryContainer.appendChild(p);
      return;
    }

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');

    // Show the mystery name
    const nameEl = document.createElement('h4');
    nameEl.textContent = mystery.name;
    cardDiv.appendChild(nameEl);

    // Optional: show the mystery image
    if (mystery.image) {
      const img = document.createElement('img');
      img.src = mystery.image;
      cardDiv.appendChild(img);
    }

    mysteryContainer.appendChild(cardDiv);
  }

  // Return our public methods under window.Game
  return {
    renderGameBoard,
    renderMysteryCharacter
  };
})();