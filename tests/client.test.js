/** @jest-environment jsdom */
const fs = require('fs');
const path = require('path');

const state = {
  board: [{ id: 1, name: 'alice', image: '/images/tomas/alice.png', isGrayedOut: false }],
  mysteryCharacter: { id: 1, name: 'bob', image: '/images/nora/bob.png' }
};
const response = (body, ok = true) => ({ ok, json: async () => body });
const settle = async () => {
  for (let i = 0; i < 10; i++) await Promise.resolve();
};

beforeEach(async () => {
  jest.useFakeTimers();
  document.body.innerHTML = fs.readFileSync(path.join(__dirname, '../client/index.html'), 'utf8');
  window.fetch = jest.fn().mockResolvedValue(response(state));
  window.confirm = jest.fn().mockReturnValue(true);
  const addListener = jest.spyOn(document, 'addEventListener').mockImplementation(() => {});
  for (const file of ['game.js', 'app.js']) {
    window.eval(fs.readFileSync(path.join(__dirname, '../client/js', file), 'utf8'));
  }
  const initialize = addListener.mock.calls.find(([event]) => event === 'DOMContentLoaded')[1];
  addListener.mockRestore();
  await initialize();
  await settle();
});

afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
});

const selectPlayer = async () => {
  document.getElementById('tomas-button').click();
  await settle();
};

test('loading the page does not reset a shared game', () => {
  expect(window.fetch).not.toHaveBeenCalled();
});

test('selecting a player joins the existing game and renders keyboard accessible cards', async () => {
  await selectPlayer();
  expect(window.fetch.mock.calls[0][0]).toBe('/api/game/join');
  const card = document.querySelector('#game-container button.card');
  expect(card).not.toBeNull();
  expect(card.getAttribute('aria-pressed')).toBe('false');
  expect(card.querySelector('img').alt).toBe('alice');
  expect(document.getElementById('player-buttons').hidden).toBe(true);
});

test('a failed player selection leaves the controls available for retry', async () => {
  window.fetch.mockResolvedValueOnce(response({ message: 'Cannot start game' }, false));
  await selectPlayer();
  expect(document.getElementById('player-buttons').hidden).toBe(false);
  expect(document.getElementById('tomas-button').disabled).toBe(false);
  expect(document.getElementById('status').textContent).toContain('Cannot start game');
  await selectPlayer();
  expect(document.querySelector('#game-container .card')).not.toBeNull();
});

test('failed moves preserve the board and report the API error', async () => {
  await selectPlayer();
  window.fetch.mockClear().mockResolvedValueOnce(response({ message: 'Move rejected' }, false));
  document.querySelector('#game-container .card').click();
  await settle();
  expect(window.fetch).toHaveBeenCalledTimes(1);
  expect(document.getElementById('status').textContent).toContain('Move rejected');
  expect(document.querySelector('#game-container .card').getAttribute('aria-pressed')).toBe('false');
});

test('rapid clicks cannot submit overlapping moves', async () => {
  await selectPlayer();
  let finish;
  window.fetch.mockClear().mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }));
  const card = document.querySelector('#game-container .card');
  card.click();
  card.click();
  expect(window.fetch).toHaveBeenCalledTimes(1);
  finish(response({ isGrayedOut: true }));
  await settle();
});

test('a keyboard move preserves focus and shows the updated gray-out state', async () => {
  await selectPlayer();
  window.fetch.mockResolvedValueOnce(response({ isGrayedOut: true }))
    .mockResolvedValueOnce(response({
      ...state, board: [{ ...state.board[0], isGrayedOut: true }]
    }));
  const card = document.querySelector('#game-container .card');
  card.focus();
  card.click();
  await settle();
  expect(document.activeElement.dataset.characterId).toBe('1');
  expect(document.activeElement.getAttribute('aria-pressed')).toBe('true');
  expect(document.activeElement.classList.contains('grayed-out')).toBe(true);
});

test('network failures do not leave the player controls disabled', async () => {
  window.fetch.mockRejectedValueOnce(new Error('Network unavailable'));
  await selectPlayer();
  expect(document.getElementById('status').textContent).toBe('Network unavailable');
  expect(document.getElementById('tomas-button').disabled).toBe(false);
  expect(document.getElementById('player-buttons').hidden).toBe(false);
});

test('a confirmed new game resets the server and refreshes the board', async () => {
  await selectPlayer();
  window.fetch.mockClear();
  document.getElementById('new-game-button').click();
  await settle();
  expect(window.confirm).toHaveBeenCalledTimes(1);
  expect(window.fetch.mock.calls[0][0]).toBe('/api/game/create');
  expect(window.fetch.mock.calls[1][0]).toContain('/api/game/state');
});

test('canceling a new game keeps the current game', async () => {
  await selectPlayer();
  window.fetch.mockClear();
  window.confirm.mockReturnValue(false);
  document.getElementById('new-game-button').click();
  await settle();
  expect(window.fetch).not.toHaveBeenCalled();
});

test('refreshes the board after another browser starts a new game', async () => {
  await selectPlayer();
  window.fetch.mockClear();
  window.fetch.mockResolvedValueOnce(response({
    ...state, board: [{ ...state.board[0], isGrayedOut: true }]
  }));
  jest.advanceTimersByTime(5000);
  await settle();
  expect(document.querySelector('#game-container .card').getAttribute('aria-pressed')).toBe('true');
});
