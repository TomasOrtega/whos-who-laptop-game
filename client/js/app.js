document.addEventListener('DOMContentLoaded', () => {
  const playerButtons = document.getElementById('player-buttons');
  const controls = document.getElementById('game-controls');
  const board = document.getElementById('game-container');
  const mystery = document.getElementById('mystery-container');
  const status = document.getElementById('status');
  let playerName = null;
  let busy = false;
  let renderedState = '';

  async function request(url, options) {
    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'The request failed. Please try again.');
    return data;
  }

  async function run(action) {
    if (busy) return;
    busy = true;
    document.querySelectorAll('#player-buttons button, #game-controls button')
      .forEach(button => { button.disabled = true; });
    board.setAttribute('aria-busy', 'true');
    try {
      await action();
      status.textContent = `Playing as ${playerName}.`;
    } catch (error) {
      status.textContent = error.message;
    } finally {
      busy = false;
      document.querySelectorAll('#player-buttons button, #game-controls button')
        .forEach(button => { button.disabled = false; });
      board.setAttribute('aria-busy', 'false');
    }
  }

  async function refresh() {
    const state = await request(`/api/game/state?playerName=${encodeURIComponent(playerName)}`);
    const serialized = JSON.stringify(state);
    if (serialized === renderedState) return;
    const focusedId = document.activeElement?.dataset.characterId;
    window.Game.renderGameBoard(playerName, state.board, characterId => run(async () => {
      await request('/api/game/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName, characterId })
      });
      await refresh();
    }));
    board.querySelectorAll('.card').forEach((card, index) => {
      card.dataset.characterId = state.board[index].id;
      if (card.dataset.characterId === focusedId) card.focus();
    });
    window.Game.renderMysteryCharacter(state.mysteryCharacter);
    renderedState = serialized;
  }

  for (const name of ['Tomas', 'Nora']) {
    document.getElementById(`${name.toLowerCase()}-button`).addEventListener('click', () => run(async () => {
      await request('/api/game/join', { method: 'POST' });
      playerName = name;
      await refresh();
      playerButtons.hidden = true;
      controls.hidden = false;
      board.hidden = false;
      mystery.hidden = false;
    }));
  }

  document.getElementById('new-game-button').addEventListener('click', () => {
    if (busy || !window.confirm('Start a new game for both players?')) return;
    run(async () => {
      await request('/api/game/create', { method: 'POST' });
      await refresh();
    });
  });

  window.setInterval(() => {
    if (playerName && playerButtons.hidden) run(refresh);
  }, 5000);
});
