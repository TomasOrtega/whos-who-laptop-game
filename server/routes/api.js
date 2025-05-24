// server/routes/api.js
const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// POST to create a new game
router.post('/game/create', gameController.createGame);

// GET the current game state
router.get('/game/state', gameController.getGameState);

// POST to join a game
router.post('/game/join', gameController.joinGame);

// POST a move
router.post('/game/move', gameController.makeMove);

module.exports = router;