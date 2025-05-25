// client/js/game.js
window.Game = (function () {
  /**
   * Renders the main game board (all characters).
   * Expects data = { board, player, mysteryCharacter }
   */
  function renderGameBoard(playerState) {
    const container = document.getElementById('game-container');
    container.innerHTML = '';

    if (!playerState || !playerState.board) {
      container.textContent = 'No active game board.';
      return;
    }

    const boardDiv = document.createElement('div');
    boardDiv.classList.add('game-board');

    playerState.board.forEach((charObj) => {
      const cardDiv = document.createElement('div');
      cardDiv.classList.add('card');

      // Clear textContent so we can build the child elements
      cardDiv.textContent = '';

      // 1) Character name
      const nameEl = document.createElement('p');
      nameEl.textContent = charObj.name || 'Unknown Character';
      cardDiv.appendChild(nameEl);

      // 2) Character image (if available)
      if (charObj.image) {
        const img = document.createElement('img');
        img.src = charObj.image;
        // Some style or dimension constraints if needed:
        // img.style.width = '80px';
        // img.style.height = 'auto';
        cardDiv.appendChild(img);
      }

      cardDiv.addEventListener('click', () => {
        // Change the clicked card's background color.
        if (cardDiv.style.backgroundColor === 'gray') {
          cardDiv.style.backgroundColor = ''; // Reset to default
        } else {
          cardDiv.style.backgroundColor = 'gray'; // Set to gray
        }

        // Proceed with sending the move to the backend.
        guessCharacter(playerState.player.id, charObj.id);
      });

      boardDiv.appendChild(cardDiv);
    });

    container.appendChild(boardDiv);
  }

  /**
   * Renders this player's mystery character at the bottom.
   */
  function renderMysteryCharacter(mystery) {
    const mysteryContainer = document.getElementById('mystery-container');
    mysteryContainer.innerHTML = '<h2>Your Mystery Character</h2>';

    // If no mystery yet, display a note
    if (!mystery || !mystery.name) {
      const noMystery = document.createElement('p');
      noMystery.textContent = 'No mystery assigned yet.';
      mysteryContainer.appendChild(noMystery);
      return;
    }

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('mystery-card');

    // Clear textContent so we can build
    cardDiv.textContent = '';

    // Name
    const nameHeader = document.createElement('h4');
    nameHeader.textContent = mystery.name;
    cardDiv.appendChild(nameHeader);

    // Image
    if (mystery.image) {
      const img = document.createElement('img');
      img.src = mystery.image;
      // optional sizing
      // img.style.width = '100px';
      cardDiv.appendChild(img);
    }

    mysteryContainer.appendChild(cardDiv);
  }

  /**
   * Sends a guess to the backend that this charId is the player's own or opponent's mystery (depending on your rules).
   */
  async function guessCharacter(playerId, charId) {
    try {
      const response = await fetch('/api/game/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId,
          moveData: { characterId: charId }
        })
      });
      const data = await response.json();
      console.log(data.message || data.error || 'Move processed.');
    } catch (error) {
      console.error(error);
    }
  }

  return {
    renderGameBoard,
    renderMysteryCharacter
  };
})();