// client/js/app.js
(function () {
  let playerName = null;

  async function createNewGame() {
    // Create/Reset the game for both players
    const res = await fetch('/api/game/create', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to create 2-player game.');
    console.log('Created new 2-player game');
  }

  async function fetchPlayerState() {
    if (!playerName) return;
    try {
      // e.g. /api/game/state?playerName=Tomas
      const res = await fetch(`/api/game/state?playerName=${playerName}`);
      if (!res.ok) throw new Error('Failed to fetch player state.');
      const data = await res.json();
      // data = { board: [....], mysteryCharacter: ... }
      window.Game.renderGameBoard(playerName, data.board);
      window.Game.renderMysteryCharacter(data.mysteryCharacter);
    } catch (err) {
      console.error(err);
      document.getElementById('game-container').textContent = 'Error loading board.';
    }
  }

  document.addEventListener('DOMContentLoaded', async () => {
    // 1. Create/Reset the 2-player game
    await createNewGame();

    // 2. Ask who this browser is controlling: "Tomas" or "Nora"?
    playerName = prompt('Are you "Tomas" or "Nora"?');
    if (!playerName) {
      alert('No player name selected; defaulting to Tomas.');
      playerName = 'Tomas';
    }

    // 3. Fetch & render that player’s board + mystery
    await fetchPlayerState();
  });
})();