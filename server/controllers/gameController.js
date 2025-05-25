// server/controllers/gameController.js

/**
 * @fileoverview
 * Defines controllers for creating a 2-player Who's Who game (Tomas & Nora),
 * retrieving a given player's state (board + mystery), and making moves.
 *
 * @example
 * // Create (or reset) a new game:
 * POST /api/game/create
 *
 * // Retrieve a player's current board & mystery:
 * GET /api/game/state?playerName=Tomas
 * // or:
 * GET /api/game/state/player/Nora
 *
 * // Make a move (toggle "isGrayedOut" on a character):
 * POST /api/game/move
 * {
 *   "playerName": "Tomas",
 *   "characterId": 2
 * }
 */

const Game = require('../models/Game');

/**
 * A placeholder typedef for an Express Request object.
 * Add or remove properties as needed for your application.
 *
 * @typedef {Object} ExpressRequest
 * @property {Object} [params] - The route parameters (e.g., req.params.playerName).
 * @property {Object} [query] - The query string parameters (e.g., req.query.playerName).
 * @property {Object} [body] - The parsed JSON body (e.g., req.body.playerName, req.body.characterId).
 */

/**
 * A placeholder typedef for an Express Response object.
 * Add or remove properties as needed for your application.
 *
 * @typedef {Object} ExpressResponse
 * @property {Function} status - Sets the HTTP status code (e.g., res.status(200)).
 * @property {Function} json - Sends a JSON response (e.g., res.json({ message: ... })).
 */

/**
 * Global instance of the two-player game.
 * Call createGame() to reset it.
 * @type {Game|null}
 */
let currentGame = null;

/**
 * Creates (or resets) the two-player "Who's Who?" game for Tomas & Nora.
 *
 * @function createGame
 * @param {ExpressRequest} req - The Express request object (no body needed).
 * @param {ExpressResponse} res - The Express response object.
 * @returns {void} Sends an HTTP 201 status and JSON confirming game creation.
 *
 * @example
 * // POST /api/game/create
 * // No request body required.
 * // Response:
 * // { "message": "Game Created" }
 */
function createGame(req, res) {
  currentGame = new Game();
  return res.status(201).json({ message: 'Game Created' });
}

/**
 * Retrieves the board + mystery character for either "Tomas" or "Nora".
 * Expects a query string (?playerName=Tomas) or a route param (/api/game/state/player/Tomas).
 *
 * @function getPlayerState
 * @param {ExpressRequest} req - The Express request object.
 * @param {ExpressResponse} res - The Express response object.
 * @returns {void} Sends JSON with "board" and "mysteryCharacter", or an error.
 *
 * @example
 * // GET /api/game/state?playerName=Tomas
 * // or GET /api/game/state/player/Nora
 * //
 * // Response:
 * // {
 * //   "board": [...],
 * //   "mysteryCharacter": { ... }
 * // }
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
 * Toggles (flips) the isGrayedOut flag for a character in the specified player's board.
 * The request body must include { "playerName": "Tomas|Nora", "characterId": <number> }.
 *
 * @function makeMove
 * @param {ExpressRequest} req - The Express request object, providing "playerName" and "characterId".
 * @param {ExpressResponse} res - The Express response object.
 * @returns {void} Sends a JSON response confirming the move or reporting an error.
 *
 * @example
 * // POST /api/game/move
 * // {
 * //   "playerName": "Tomas",
 * //   "characterId": 2
 * // }
 * //
 * // Response:
 * // {
 * //   "message": "Move OK: Tomas grayed out ID 2."
 * // }
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