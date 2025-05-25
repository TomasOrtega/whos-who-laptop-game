// server/models/Game.js

const fs = require('fs');
const path = require('path');

/**
 * Represents a two-player "Who's Who?" game for Tomas and Nora.
 * Each player has a board of character images, and a mystery character
 * is chosen from the *other* player's board. A move toggles the 'isGrayedOut'
 * flag on the player's own board.
 */
class Game {
  /** @type {Array<Object>} The board representing Tomas's characters. */
  #tomasBoard;

  /** @type {Array<Object>} The board representing Nora's characters. */
  #noraBoard;

  /** @type {Object|null} Tomas's mystery character, chosen from Nora's board. */
  #tomasMystery;

  /** @type {Object|null} Nora's mystery character, chosen from Tomas's board. */
  #noraMystery;

  /**
   * Constructs a new Game instance by building both Tomas's and Nora's boards
   * and picking a random mystery character for each from the opposite board.
   */
  constructor() {
    // Build both boards
    this.#tomasBoard = this.#buildBoard('tomas');
    this.#noraBoard = this.#buildBoard('nora');

    // Assign each player's mystery from the opposite board
    this.#tomasMystery = this.#pickMystery(this.#noraBoard);
    this.#noraMystery = this.#pickMystery(this.#tomasBoard);
  }

  /**
   * Reads a subfolder under client/images/<playerFolder> and returns an array of
   * character objects. Each character object includes:
   *   - id
   *   - name
   *   - image (URL path under /images/<playerFolder>)
   *   - isGrayedOut = false by default
   *
   * @private
   * @param {string} playerFolder - "tomas" or "nora"
   * @returns {Array<Object>} An array of character objects for the given player.
   */
  #buildBoard(playerFolder) {
    // Example path: .../client/images/tomas
    const imagesDir = path.join(__dirname, '..', '..', 'client', 'images', playerFolder);

    let files;
    try {
      files = fs.readdirSync(imagesDir);
    } catch (err) {
      // If the folder doesn't exist or is unreadable, return an empty board
      console.warn(`[Game] Warning: Could not read folder "${imagesDir}":`, err);
      return [];
    }

    // Filter only typical image files, then sort them
    files = files
      .filter(file => /\.(png|jpe?g|gif|svg)$/i.test(file))
      .sort((a, b) => a.localeCompare(b));

    // Map to character objects
    return files.map((filename, index) => ({
      id: index + 1,
      name: path.basename(filename, path.extname(filename)),
      image: `/images/${playerFolder}/${filename}`,
      isGrayedOut: false
    }));
  }

  /**
   * Randomly picks one character from the given board. Returns null if the board is empty.
   * @private
   * @param {Array<Object>} board - The board array from which to pick a character.
   * @returns {Object|null} A random character object, or null if the board is empty.
   */
  #pickMystery(board) {
    if (!board || board.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * board.length);
    return board[randomIndex];
  }

  /**
   * Retrieves the board and mystery character for the specified player.
   *
   * @param {string} playerName - The player's name: "Tomas" or "Nora".
   * @returns {{ board: Array<Object>, mysteryCharacter: Object|null }}
   * An object containing the player's board array and their mystery character.
   * @throws {Error} If playerName is neither "Tomas" nor "Nora".
   */
  getPlayerState(playerName) {
    switch (playerName) {
      case 'Tomas':
        return {
          board: this.#tomasBoard,
          mysteryCharacter: this.#tomasMystery
        };
      case 'Nora':
        return {
          board: this.#noraBoard,
          mysteryCharacter: this.#noraMystery
        };
      default:
        throw new Error(`Unknown player "${playerName}". Must be "Tomas" or "Nora".`);
    }
  }

  /**
   * Toggles the `isGrayedOut` flag for a character on the specified player's board.
   * Example: If "Tomas" toggles ID=2, then we flip `isGrayedOut` for ID=2 on Tomas's board.
   *
   * @param {string} playerName - The player's name: "Tomas" or "Nora".
   * @param {number} characterId - The ID of the character to be toggled.
   * @returns {void}
   * @throws {Error} If the player name is invalid, or the character ID doesn’t exist on that board.
   */
  handleMove(playerName, characterId) {
    let board;
    if (playerName === 'Tomas') {
      board = this.#tomasBoard;
    } else if (playerName === 'Nora') {
      board = this.#noraBoard;
    } else {
      throw new Error(`Invalid player name: "${playerName}"`);
    }

    const charObj = board.find(c => c.id === characterId);
    if (!charObj) {
      throw new Error(`Character ${characterId} not found on ${playerName}'s board.`);
    }

    // Flip the isGrayedOut flag
    charObj.isGrayedOut = !charObj.isGrayedOut;
  }
}

module.exports = Game;