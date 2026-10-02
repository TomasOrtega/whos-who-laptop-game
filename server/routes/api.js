const router = require('express').Router();
const game = require('../controllers/gameController');

router.post('/game/join', game.joinGame);
router.post('/game/create', game.createGame);
router.get('/game/state', game.getPlayerState);
router.get('/game/state/player/:playerName', game.getPlayerState);
router.post('/game/move', game.makeMove);
router.use((req, res) => res.status(404).json({ message: 'API endpoint not found.' }));

module.exports = router;
