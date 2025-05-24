// server/controllers/gameController.js
const Game = require('../models/Game');
const Player = require('../models/Player');

/**
 * Creates a new game instance. This will load characters from JSON each time.
 */
function createGame(req, res) {
  global.currentGame = new Game();
  return res.status(201).json({ message: 'Game Created' });
}

/**
 * Returns the current game state or 404 if no game is found.
 */
function getGameState(req, res) {
  if (!global.currentGame) {
    return res.status(404).json({ message: 'No active game found.' });
  }
  return res.json(global.currentGame.getState());
}

/**
 * Joins a player to the current game (an example method).
 */
function joinGame(req, res) {
  if (!global.currentGame) {
    return res.status(400).json({ message: 'No active game to join.' });
  }
  const { playerId, playerName } = req.body;
  const player = new Player(playerId, playerName);
  global.currentGame.addPlayer(player);

  return res.json({ message: `Player ${playerName} joined.` });
}

/**
 * Processes a move from a player, e.g. guessing a character, etc.
 */
function makeMove(req, res) {
  if (!global.currentGame) {
    return res.status(400).json({ message: 'No active game found.' });
  }
  const { playerId, moveData } = req.body;
  try {
    global.currentGame.handleMove(playerId, moveData);
    return res.json({ message: 'Move processed successfully.' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

module.exports = {
  createGame,
  getGameState,
  joinGame,
  makeMove
};