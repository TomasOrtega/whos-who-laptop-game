// server/routes/api.js
const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// Create a new game
router.post('/game/create', gameController.createGame);

// Get the shared game board (no personal mystery info)
router.get('/game/state', gameController.getGameState);

// Get state for a specific player (including their unique mystery)
router.get('/game/state/player/:playerId', gameController.getGameStateForPlayer);

// Join a game
router.post('/game/join', gameController.joinGame);

// Make a move
router.post('/game/move', gameController.makeMove);

module.exports = router;