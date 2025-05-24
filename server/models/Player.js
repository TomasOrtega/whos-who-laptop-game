// server/models/Player.js

class Player {
  /**
   * @param {string} id - Unique identifier for the player (can be socket ID, session ID, etc.)
   * @param {string} name - Player's display name
   */
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

module.exports = Player;