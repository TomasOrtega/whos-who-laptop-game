// server/controllers/gameController.js
const Game = require('../models/Game');

/**
 * A global instance of the two-player game.
 * Call createGame() to reset it.
 * @type {Game|null}
 */
let currentGame = null;

/**
 * Creates (or resets) the two-player Who's Who game and
 * stores the instance in the global `currentGame`.
 *
 * @function createGame
 * @param {import('express').Request} req - The Express HTTP request object.
 * @param {import('express').Response} res - The Express HTTP response object.
 * @returns {void} Sends a JSON response with status 201 on success.
 */
function createGame(req, res) {
  currentGame = new Game();
  return res.status(201).json({ message: 'Game Created' });
}

/**
 * Retrieves the state (board + mystery) for a specified player ("Tomas" or "Nora").
 * - Expects a query string `?playerName=` or a route param `/:playerName`.
 *
 * @function getPlayerState
 * @param {import('express').Request} req - The Express HTTP request object.
 * @param {import('express').Response} res - The Express HTTP response object.
 * @returns {void} Sends a JSON response containing the player's board and mystery character.
 *
 * @example
 * GET /api/game/state?playerName=Tomas
 * // or
 * GET /api/game/state/Nora
 */
function getPlayerState(req, res) {
  if (!currentGame) {
    return res.status(404).json({ message: 'No active game found.' });
  }

  const playerName = req.params.playerName || req.query.playerName;
  if (!playerName) {
    return res.status(400).json({ message: 'playerName is required (Tomas/Nora).' });
  }

  try {
    const state = currentGame.getPlayerState(playerName);
    return res.json(state);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

/**
 * Toggles the gray-out (eliminate) state for a character on the specified player's board.
 * - Requires a JSON body: { "playerName": "Tomas|Nora", "characterId": 3 }
 *
 * @function makeMove
 * @param {import('express').Request} req - The Express HTTP request object.
 * @param {import('express').Response} res - The Express HTTP response object.
 * @returns {void} Sends a JSON response confirming the move on success.
 *
 * @example
 * POST /api/game/move
 * {
 *   "playerName": "Tomas",
 *   "characterId": 2
 * }
 */
function makeMove(req, res) {
  if (!currentGame) {
    return res.status(400).json({ message: 'No active game found.' });
  }

  const { playerName, characterId } = req.body;
  if (!playerName || typeof characterId !== 'number') {
    return res.status(400).json({ message: 'playerName and numeric characterId are required.' });
  }

  try {
    currentGame.handleMove(playerName, characterId);
    return res.json({ message: `Move OK: ${playerName} grayed out ID ${characterId}.` });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

module.exports = {
  createGame,
  getPlayerState,
  makeMove
};