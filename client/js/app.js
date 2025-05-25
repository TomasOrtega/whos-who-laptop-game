// client/js/app.js
(function() {
  let playerId = null;

  async function createNewGame() {
    try {
      const res = await fetch('/api/game/create', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to create game.');
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Joins the game with a given playerId and playerName.
   */
  async function joinGame(id, name) {
    try {
      const res = await fetch('/api/game/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: id, playerName: name })
      });
      if (!res.ok) throw new Error('Failed to join game.');
      const data = await res.json();
      console.log('Joined game:', data);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Fetch the personal game state for a given playerId.
   */
  async function fetchPlayerState(id) {
    try {
      const res = await fetch(`/api/game/state/player/${id}`);
      if (!res.ok) throw new Error('Failed to fetch player state.');
      const data = await res.json();
      // data = { board, player, mysteryCharacter }
      window.Game.renderGameBoard(data);
      window.Game.renderMysteryCharacter(data.mysteryCharacter);
    } catch (err) {
      console.error(err);
      const container = document.getElementById('game-container');
      container.textContent = 'Error loading player state.';
    }
  }

  document.addEventListener('DOMContentLoaded', async () => {
    // 1. Create a new game (or you could do this on a "New Game" button)
    await createNewGame();

    // 2. Prompt for a name/ID
    let chosenName = prompt('Enter your player name/ID:');
    if (!chosenName) {
      // If user leaves it blank or cancels, generate one
      chosenName = 'Guest_' + Math.floor(Math.random() * 1000);
    }
    playerId = chosenName;

    // 3. Join the game as that ID/name
    await joinGame(playerId, chosenName);

    // 4. Fetch & render personal state
    await fetchPlayerState(playerId);
  });
})();