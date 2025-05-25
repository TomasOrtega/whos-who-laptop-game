// server/routes/api.js
const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// Create the 2-player game
router.post('/game/create', gameController.createGame);

// For Tomas or Nora's board+state
// e.g. GET /api/game/state?playerName=Tomas
// or    GET /api/game/state/player/Nora
router.get('/game/state', gameController.getPlayerState);
router.get('/game/state/player/:playerName', gameController.getPlayerState);

// Make a move (gray out a card)
router.post('/game/move', gameController.makeMove);

module.exports = router;