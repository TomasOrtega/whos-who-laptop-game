// server/routes/api.js

const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

/**
 * POST /api/game/create
 * Creates or resets a two-player game (Tomas & Nora).
 * @name POST/api/game/create
 * @function
 * @memberof module:routes/api
 * @inner
 * @param {express.Request} req - Express request
 * @param {express.Response} res - Express response
 */
router.post('/game/create', gameController.createGame);

/**
 * GET /api/game/state
 * Fetches the current board & mystery for either "Tomas" or "Nora" from query parameters.
 * Example: GET /api/game/state?playerName=Tomas
 * @name GET/api/game/state
 * @function
 * @memberof module:routes/api
 * @inner
 * @param {express.Request} req - Express request
 * @param {express.Response} res - Express response
 */
router.get('/game/state', gameController.getPlayerState);

/**
 * GET /api/game/state/player/:playerName
 * Fetches the current board & mystery by a route parameter.
 * Example: GET /api/game/state/player/Nora
 * @name GET/api/game/state/player/:playerName
 * @function
 * @memberof module:routes/api
 * @inner
 * @param {express.Request} req - Express request
 * @param {express.Response} res - Express response
 */
router.get('/game/state/player/:playerName', gameController.getPlayerState);

/**
 * POST /api/game/move
 * Toggles the gray-out state of a character on the specified player's board.
 * Body must include: { "playerName": "Tomas|Nora", "characterId": 1 }
 * @name POST/api/game/move
 * @function
 * @memberof module:routes/api
 * @inner
 * @param {express.Request} req - Express request
 * @param {express.Response} res - Express response
 */
router.post('/game/move', gameController.makeMove);

module.exports = router;