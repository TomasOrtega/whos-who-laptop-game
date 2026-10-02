const fs = require('fs');
const path = require('path');

/** A two-player game with independent boards and mysteries from the opposite board. */
class Game {
  #players;

  constructor() {
    const tomas = this.#buildBoard('tomas');
    const nora = this.#buildBoard('nora');
    this.#players = {
      Tomas: { board: tomas, mysteryCharacter: this.#pickMystery(nora) },
      Nora: { board: nora, mysteryCharacter: this.#pickMystery(tomas) }
    };
  }

  #buildBoard(folder) {
    const directory = path.join(__dirname, '../../client/images', folder);
    const files = fs.readdirSync(directory, { withFileTypes: true })
      .filter(entry => entry.isFile() && /\.(png|jpe?g|gif|svg|webp)$/i.test(entry.name))
      .map(entry => entry.name)
      .sort();
    if (!files.length) throw new Error(`No character images found for ${folder}.`);

    return files.map((filename, index) => ({
      id: index + 1,
      name: path.basename(filename, path.extname(filename)),
      image: `/images/${folder}/${encodeURIComponent(filename)}`,
      isGrayedOut: false
    }));
  }

  #pickMystery(board) {
    return { ...board[Math.floor(Math.random() * board.length)] };
  }

  #getPlayer(name) {
    if (typeof name !== 'string' || !Object.hasOwn(this.#players, name)) {
      throw new Error('playerName must be Tomas or Nora.');
    }
    return this.#players[name];
  }

  /**
   * Return a snapshot so callers cannot change the game without making a move.
   * @param {string} playerName - Tomas or Nora.
   * @returns {{board: Object[], mysteryCharacter: Object}}
   */
  getPlayerState(playerName) {
    const { board, mysteryCharacter } = this.#getPlayer(playerName);
    return {
      board: board.map(character => ({ ...character })),
      mysteryCharacter: { ...mysteryCharacter }
    };
  }

  /**
   * @param {string} playerName - Tomas or Nora.
   * @param {number} characterId - A positive integer from that player's board.
   * @returns {boolean} The new gray-out state.
   */
  handleMove(playerName, characterId) {
    const { board } = this.#getPlayer(playerName);
    if (!Number.isSafeInteger(characterId) || characterId < 1) {
      throw new Error('characterId must be a positive integer.');
    }
    const character = board.find(item => item.id === characterId);
    if (!character) throw new Error(`Character ${characterId} not found on ${playerName}'s board.`);
    character.isGrayedOut = !character.isGrayedOut;
    return character.isGrayedOut;
  }
}

module.exports = Game;
