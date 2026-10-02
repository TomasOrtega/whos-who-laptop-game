const Game = require('../models/Game');

let currentGame = null;

/** Explicitly reset the shared game. */
function createGame(req, res) {
  currentGame = new Game();
  return res.status(201).json({ message: 'Game Created' });
}

/** Join the shared game without resetting another browser's progress. */
function joinGame(req, res) {
  currentGame ??= new Game();
  return res.json({ message: 'Game Joined' });
}

function getPlayerState(req, res) {
  if (!currentGame) return res.status(404).json({ message: 'No active game found.' });
  try {
    return res.json(currentGame.getPlayerState(req.params.playerName ?? req.query.playerName));
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

function makeMove(req, res) {
  if (!currentGame) return res.status(404).json({ message: 'No active game found.' });
  const { playerName, characterId } = req.body ?? {};
  try {
    const isGrayedOut = currentGame.handleMove(playerName, characterId);
    return res.json({ message: 'Move OK', isGrayedOut });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = { createGame, joinGame, getPlayerState, makeMove };
