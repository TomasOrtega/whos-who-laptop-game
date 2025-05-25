// server/controllers/gameController.js
const Game = require('../models/Game');

/**
 * Global instance of the two-player game. 
 * Call createGame() to reset.
 */
let currentGame = null;

/**
 * Create a fresh two-player game for Tomas and Nora.
 */
function createGame(req, res) {
  currentGame = new Game();
  return res.status(201).json({ message: 'Game Created' });
}

/**
 * Get the board + mystery for either "Tomas" or "Nora".
 * Expects ?playerName=Tomas or ?playerName=Nora or 
 * route param /:playerName.
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
 * Make a move: Gray out a character on the player's board.
 * Body must include { playerName, characterId }
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