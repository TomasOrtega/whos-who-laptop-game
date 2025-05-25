// server/models/Game.js
const fs = require('fs');
const path = require('path');

class Game {
  constructor() {
    // Determine the images folder path.
    const imagesDir = path.join(__dirname, '..', '..', 'client', 'images');

    // Read all files from the images directory.
    let files = fs.readdirSync(imagesDir);

    // Filter to include only typical image files.
    files = files.filter(file => /\.(png|jpe?g|gif|svg)$/i.test(file));

    // Sort the filenames in alphabetical order.
    files.sort((a, b) => a.localeCompare(b));

    // Create a characters array from the sorted files.
    // Use the filename (without extension) as the "name"
    // and assign the index+1 as the id.
    this.characters = files.map((filename, index) => {
      const name = path.basename(filename, path.extname(filename));
      return {
        id: index + 1, // alphabetical order
        name,
        image: `/images/${filename}`, // since client folder is served statically
        description: "" // you might leave description blank or add default text
      };
    });

    // Everything else remains similar.
    this.board = this.characters.slice();
    this.players = [];
    this.playerMysteries = {};
  }

  /**
   * Registers a new player and assigns the player a random "mystery" from the board.
   */
  addPlayer(player) {
    this.players.push(player);
    const randomIndex = Math.floor(Math.random() * this.board.length);
    this.playerMysteries[player.id] = this.board[randomIndex];
  }

  /**
   * Returns publicly visible state (board plus minimal player info).
   */
  getState() {
    return {
      board: this.board,
      players: this.players.map(p => ({
        id: p.id,
        name: p.name
      }))
    };
  }

  /**
   * Returns the state for a specific player, including their personal mystery.
   */
  getPlayerState(playerId) {
    const player = this.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error(`Player with ID ${playerId} not found.`);
    }
    return {
      board: this.board,
      player: {
        id: player.id,
        name: player.name
      },
      mysteryCharacter: this.playerMysteries[player.id] || null
    };
  }

  /**
   * Processes a move made by a player.
   */
  handleMove(playerId, moveData) {
    const { characterId } = moveData;
    if (typeof characterId !== 'number') {
      throw new Error('Invalid or missing characterId.');
    }
    const mystery = this.playerMysteries[playerId];
    if (!mystery) {
      throw new Error(`No mystery assigned for player ${playerId}.`);
    }
    console.log(`Player ${playerId} clicked: ID ${characterId}.`);
  }
}

module.exports = Game;