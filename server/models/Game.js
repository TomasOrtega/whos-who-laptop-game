// server/models/Game.js
const fs = require('fs');
const path = require('path');

/**
 * A two-player "Who's Who?" game.
 * Tomas has a board loaded from, e.g., client/images/tomas.
 * Nora has a board loaded from, e.g., client/images/nora.
 * Tomas's mystery is chosen from Nora's board; Nora's from Tomas's board.
 */

class Game {
  constructor() {
    // 1. Read "tomas" images folder
    const tomasImagesDir = path.join(__dirname, '..', '..', 'client', 'images', 'tomas');
    let tomasFiles = fs.readdirSync(tomasImagesDir)
      .filter(file => /\.(png|jpe?g|gif|svg)$/i.test(file))
      .sort((a, b) => a.localeCompare(b));

    // 2. Read "nora" images folder
    const noraImagesDir = path.join(__dirname, '..', '..', 'client', 'images', 'nora');
    let noraFiles = fs.readdirSync(noraImagesDir)
      .filter(file => /\.(png|jpe?g|gif|svg)$/i.test(file))
      .sort((a, b) => a.localeCompare(b));

    // 3. Build Tomas's board
    this.tomasBoard = tomasFiles.map((filename, index) => ({
      id: index + 1,
      name: path.basename(filename, path.extname(filename)),
      image: `/images/tomas/${filename}`,
      isGrayedOut: false
    }));

    // 4. Build Nora's board
    this.noraBoard = noraFiles.map((filename, index) => ({
      id: index + 1,
      name: path.basename(filename, path.extname(filename)),
      image: `/images/nora/${filename}`,
      isGrayedOut: false
    }));

    // 5. Mystery for Tomas → random pick from Nora’s board
    this.tomasMystery = this.noraBoard[
      Math.floor(Math.random() * this.noraBoard.length)
    ];

    // 6. Mystery for Nora → random pick from Tomas’s board
    this.noraMystery = this.tomasBoard[
      Math.floor(Math.random() * this.tomasBoard.length)
    ];
  }

  /**
   * Returns the board (Tomas's or Nora's) plus that player’s mystery.
   * @param {string} playerName - either "Tomas" or "Nora"
   */
  getPlayerState(playerName) {
    if (playerName === 'Tomas') {
      return {
        board: this.tomasBoard,
        mysteryCharacter: this.tomasMystery
      };
    } else if (playerName === 'Nora') {
      return {
        board: this.noraBoard,
        mysteryCharacter: this.noraMystery
      };
    }
    throw new Error(`Unknown player "${playerName}"`);
  }

  /**
   * Grays out a character on the provided player's own board.
   * For example, if "Tomas" clicks ID=2, we mark ID=2 on Tomas's board as gray.
   * @param {string} playerName - "Tomas" or "Nora"
   * @param {number} characterId - ID of the character on that player's board
   */
  handleMove(playerName, characterId) {
    let board;
    if (playerName === 'Tomas') {
      board = this.tomasBoard;
    } else if (playerName === 'Nora') {
      board = this.noraBoard;
    } else {
      throw new Error(`Invalid player name: ${playerName}`);
    }

    const charObj = board.find(c => c.id === characterId);
    if (!charObj) {
      throw new Error(`Character ${characterId} not found on ${playerName}'s board.`);
    }
    charObj.isGrayedOut = !charObj.isGrayedOut; // Flip the isGrayedOut flag
  }
}

module.exports = Game;