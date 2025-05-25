// tests/sample.test.js
const request = require('supertest');
const app = require('../server/index');

describe("Two-player Tomas/Nora 'Who's Who' Tests", () => {
  let createdGameResponse;

  // 1. Before all tests, create (reset) the 2-player game
  beforeAll(async () => {
    createdGameResponse = await request(app).post('/api/game/create');
  });

  it('should respond with 201 and "Game Created"', async () => {
    expect(createdGameResponse.statusCode).toBe(201);
    expect(createdGameResponse.body).toEqual({ message: 'Game Created' });
  });

  it("should fetch Tomas's board successfully", async () => {
    const response = await request(app).get('/api/game/state?playerName=Tomas');
    expect(response.statusCode).toBe(200);

    // Expect something like { board: [...], mysteryCharacter: {...} }
    expect(response.body).toHaveProperty('board');
    expect(response.body).toHaveProperty('mysteryCharacter');

    // Save the first character ID for toggling
    const { board } = response.body;
    expect(board.length).toBeGreaterThan(0);

    // Check that each board item has isGrayedOut property
    board.forEach((charObj) => {
      expect(charObj).toHaveProperty('isGrayedOut');
      expect(typeof charObj.isGrayedOut).toBe('boolean');
    });
  });

  let firstCharId;
  it("should toggle a character on Tomas's board (move)", async () => {
    // 2. First fetch Tomas's board to see an ID
    const fetchRes = await request(app).get('/api/game/state?playerName=Tomas');
    const tomasBoard = fetchRes.body.board;
    expect(tomasBoard.length).toBeGreaterThan(0);

    // We'll pick the first character to toggle
    firstCharId = tomasBoard[0].id;

    // 3. Send a move request to toggle isGrayedOut
    const moveRes = await request(app)
      .post('/api/game/move')
      .send({ playerName: 'Tomas', characterId: firstCharId });

    // Expect success (2xx)
    expect(moveRes.statusCode).toBe(200);
    expect(moveRes.body).toHaveProperty('message');
  });

  it("should see that the character is now grayed out", async () => {
    // Re-fetch Tomas's board
    const refetch = await request(app).get('/api/game/state?playerName=Tomas');
    expect(refetch.statusCode).toBe(200);

    const updatedBoard = refetch.body.board;
    const toggledChar = updatedBoard.find((c) => c.id === firstCharId);
    expect(toggledChar).toBeDefined();
    expect(toggledChar.isGrayedOut).toBe(true);
  });

  it("should un-gray it again (toggle back off) on second click", async () => {
    // Toggle the same char again
    const moveRes = await request(app)
      .post('/api/game/move')
      .send({ playerName: 'Tomas', characterId: firstCharId });
    expect(moveRes.statusCode).toBe(200);

    // Now it should be isGrayedOut = false
    const refetch = await request(app).get('/api/game/state?playerName=Tomas');
    expect(refetch.statusCode).toBe(200);

    const updatedBoard = refetch.body.board;
    const toggledChar = updatedBoard.find((c) => c.id === firstCharId);
    expect(toggledChar.isGrayedOut).toBe(false);
  });
});