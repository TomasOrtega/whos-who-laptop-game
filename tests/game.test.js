const fs = require('fs');
const Game = require('../server/models/Game');

afterEach(() => jest.restoreAllMocks());

test.each(['Tomas', 'Nora'])('%s gets their own board and the other board\'s mystery', player => {
  const game = new Game();
  const other = player === 'Tomas' ? 'Nora' : 'Tomas';
  const state = game.getPlayerState(player);
  expect(state.board).toHaveLength(5);
  expect(state.board[0].image).toContain(`/images/${player.toLowerCase()}/`);
  expect(game.getPlayerState(other).board).toContainEqual(state.mysteryCharacter);
});

test('eliminating a character does not change the other player\'s mystery', () => {
  const game = new Game();
  const mystery = game.getPlayerState('Nora').mysteryCharacter;
  game.handleMove('Tomas', mystery.id);
  expect(game.getPlayerState('Nora').mysteryCharacter.isGrayedOut).toBe(false);
});

test('returned state cannot mutate the game', () => {
  const game = new Game();
  const state = game.getPlayerState('Tomas');
  state.board[0].isGrayedOut = true;
  state.board.pop();
  state.mysteryCharacter.name = 'Changed';
  const fresh = game.getPlayerState('Tomas');
  expect(fresh.board).toHaveLength(5);
  expect(fresh.board[0].isGrayedOut).toBe(false);
  expect(fresh.mysteryCharacter.name).not.toBe('Changed');
});

test('image filenames are URL encoded and directories are excluded', () => {
  const entries = [
    { name: 'a #?.PNG', isFile: () => true },
    { name: 'b.png', isFile: () => false },
    { name: 'notes.txt', isFile: () => true }
  ];
  jest.spyOn(fs, 'readdirSync').mockImplementation((directory, options) =>
    options?.withFileTypes ? entries : entries.map(entry => entry.name)
  );
  const board = new Game().getPlayerState('Tomas').board;
  expect(board).toEqual([
    { id: 1, name: 'a #?', image: '/images/tomas/a%20%23%3F.PNG', isGrayedOut: false }
  ]);
});

test('empty or unreadable boards cannot start an unplayable game', () => {
  jest.spyOn(fs, 'readdirSync').mockReturnValue([]);
  expect(() => new Game()).toThrow(/No character images/);
  fs.readdirSync.mockImplementation(() => { throw new Error('unreadable'); });
  expect(() => new Game()).toThrow(/unreadable/);
});
