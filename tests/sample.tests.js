// tests/sample.test.js
const request = require('supertest');
const app = require('../server/index');

describe('Who’s Who? JSON-based Tests', () => {
  it('should serve the client index page (GET /)', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });

  it('should return 404 if no game is active (GET /api/game/state)', async () => {
    const response = await request(app).get('/api/game/state');
    expect(response.statusCode).toBe(404);
  });

  it('should create a new game (POST /api/game/create)', async () => {
    const response = await request(app).post('/api/game/create');
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ message: 'Game Created' });
  });

  it('should return a valid game state after creation (GET /api/game/state)', async () => {
    const stateResponse = await request(app).get('/api/game/state');
    expect(stateResponse.statusCode).toBe(200);
    expect(stateResponse.body).toHaveProperty('board');
    expect(stateResponse.body.board.length).toBeGreaterThan(0);
  });
});