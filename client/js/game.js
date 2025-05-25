// client/js/game.js

window.Game = (function () {
  let currentPlayerName = null;

  /**
   * Fetches the current player state from the server and re-renders the board + mystery.
   */
  async function refetchAndRenderBoard() {
    if (!currentPlayerName) return;

    try {
      const res = await fetch(`/api/game/state?playerName=${currentPlayerName}`);
      if (!res.ok) throw new Error('Failed to fetch player state after move.');
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
   * Renders the main game board for the specified player’s data.
   * Clicking a character toggles its "isGrayedOut" state on the server,
   * then we re-fetch the updated board.
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

      // Optional: display character image
      if (charObj.image) {
        const img = document.createElement('img');
        img.src = charObj.image;
        cardDiv.appendChild(img);
      }

      // If it is already grayed out, apply gray.
      if (charObj.isGrayedOut) {
        cardDiv.style.backgroundColor = 'gray';
      }

      // On card click, toggle the gray-out state via the server.
      cardDiv.addEventListener('click', async () => {
        try {
          // POST the move to the server, flipping isGrayedOut for this char.
          const response = await fetch('/api/game/move', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playerName, characterId: charObj.id })
          });
          const result = await response.json();
          console.log(result.message || result.error);

          // Re-fetch the entire board so the UI will update.
          await refetchAndRenderBoard();
        } catch (error) {
          console.error('Move error', error);
        }
      });

      container.appendChild(cardDiv);
    });
  }

  /**
   * Renders the player's "mystery" character, which is picked from the OTHER player's board.
   */
  function renderMysteryCharacter(mystery) {
    const mysteryContainer = document.getElementById('mystery-container');
    mysteryContainer.innerHTML = '<h2>Your Mystery (from opponent’s board)</h2>';

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

  // Expose our render methods to other scripts.
  return {
    renderGameBoard,
    renderMysteryCharacter
  };
})();