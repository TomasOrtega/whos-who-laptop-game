// server/controllers/gameController.js
const Game = require('../models/Game');
const Player = require('../models/Player');

/**
 * Creates a new global game instance.
 */
function createGame(req, res) {
  global.currentGame = new Game();
  return res.status(201).json({ message: 'Game Created' });
}

/**
 * Returns a global, shared state (everyone's board, but no personal mysteries).
 */
function getGameState(req, res) {
  if (!global.currentGame) {
    return res.status(404).json({ message: 'No active game found.' });
  }
  return res.json(global.currentGame.getState());
}

/**
 * Returns the game state specifically for a single player, including their unique mystery.
 * If you want the playerId in the query (e.g. /api/game/state/player?playerId=...), do that.
 * Alternatively, route param: /api/game/state/player/:playerId
 */
function getGameStateForPlayer(req, res) {
  if (!global.currentGame) {
    return res.status(404).json({ message: 'No active game found.' });
  }

  const playerId = req.params.playerId || req.query.playerId;
  if (!playerId) {
    return res.status(400).json({ message: 'playerId is required.' });
  }

  try {
    const playerState = global.currentGame.getPlayerState(playerId);
    return res.json(playerState);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}

/**
 * Joins a player to the current game.
 */
function joinGame(req, res) {
  if (!global.currentGame) {
    return res.status(400).json({ message: 'No active game to join.' });
  }
  const { playerId, playerName } = req.body;
  const player = new Player(playerId, playerName);
  global.currentGame.addPlayer(player);

  return res.json({ message: `Player ${playerName} joined.`, playerId });
}

/**
 * Makes a move, e.g. guessing who the mystery character is.
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
  getGameStateForPlayer,
  joinGame,
  makeMove
};