// server/models/Game.js
const fs = require('fs');
const path = require('path');

class Game {
  constructor() {
    // Read and parse the characters JSON
    const jsonPath = path.join(__dirname, '..', 'data', 'characters.json');
    const fileContent = fs.readFileSync(jsonPath, 'utf-8');
    this.characters = JSON.parse(fileContent);

    // For a "Who’s Who?" style game, you might place them all on the board or a random subset.
    // Example: using them all directly
    this.board = this.characters.slice(); // shallow copy
    this.players = [];
  }

  /**
   * Returns serializable data for the client.
   */
  getState() {
    return {
      board: this.board,
      players: this.players
    };
  }

  /**
   * Adds a new Player instance to the game.
   * @param {Object} player - A Player object.
   */
  addPlayer(player) {
    this.players.push(player);
  }

  /**
   * Example move handler. This might set a different character or track guesses.
   * @param {string} playerId
   * @param {Object} moveData
   */
  handleMove(playerId, moveData) {
    // For demonstration, let’s suppose moveData has a "characterId" we want to highlight.
    const { characterId } = moveData;

    if (typeof characterId !== 'number') {
      throw new Error('Invalid or missing characterId in moveData.');
    }

    // Possibly find the character in board and mark it as "guessed" or something.
    const characterIndex = this.board.findIndex((c) => c.id === characterId);
    if (characterIndex === -1) {
      throw new Error(`Character with ID ${characterId} not found on board.`);
    }

    // Just a dummy property to show a guess or something
    this.board[characterIndex].guessedBy = playerId;
  }
}

module.exports = Game;