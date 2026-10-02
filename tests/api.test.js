const request = require('supertest');

let app;

beforeEach(() => {
  jest.resetModules();
  app = require('../server/index');
});

test('serves the game and character images', async () => {
  await request(app).get('/').expect(200).expect(/Play as Tomas/);
  await request(app).get('/images/tomas/alice.png').expect(200).expect('Content-Type', /image\/png/);
});

test('reports a missing game consistently', async () => {
  await request(app).get('/api/game/state?playerName=Tomas').expect(404);
  await request(app).post('/api/game/move')
    .send({ playerName: 'Tomas', characterId: 1 }).expect(404);
});

test('joining from another browser preserves both players and their mysteries', async () => {
  await request(app).post('/api/game/join').expect(200);
  const before = (await request(app).get('/api/game/state?playerName=Tomas')).body;
  await request(app).post('/api/game/move')
    .send({ playerName: 'Tomas', characterId: before.board[0].id }).expect(200);
  await request(app).post('/api/game/join').expect(200);
  const after = (await request(app).get('/api/game/state?playerName=Tomas')).body;
  expect(after.board[0].isGrayedOut).toBe(true);
  expect(after.mysteryCharacter).toEqual(before.mysteryCharacter);
  await request(app).get('/api/game/state/player/Nora').expect(200);
});

test('a move toggles only the selected board and reports its new state', async () => {
  await request(app).post('/api/game/create').expect(201, { message: 'Game Created' });
  for (const isGrayedOut of [true, false]) {
    const response = await request(app).post('/api/game/move')
      .send({ playerName: 'Tomas', characterId: 1 }).expect(200);
    expect(response.body.isGrayedOut).toBe(isGrayedOut);
    const state = (await request(app).get('/api/game/state?playerName=Tomas')).body;
    expect(state.board[0].isGrayedOut).toBe(isGrayedOut);
    const other = (await request(app).get('/api/game/state?playerName=Nora')).body;
    expect(other.board.every(character => !character.isGrayedOut)).toBe(true);
  }
});

test('explicitly creating a game resets the boards', async () => {
  await request(app).post('/api/game/create').expect(201);
  await request(app).post('/api/game/move').send({ playerName: 'Nora', characterId: 1 }).expect(200);
  await request(app).post('/api/game/create').expect(201);
  const state = (await request(app).get('/api/game/state?playerName=Nora')).body;
  expect(state.board.every(character => !character.isGrayedOut)).toBe(true);
});

test.each(['', '?playerName=Other', '?playerName=Tomas&playerName=Nora', '?playerName[name]=Tomas'])(
  'rejects invalid player queries: %s', async query => {
    await request(app).post('/api/game/create');
    const response = await request(app).get(`/api/game/state${query}`).expect(400);
    expect(response.body.message).toEqual(expect.any(String));
  }
);

test.each([
  {}, { playerName: 'Other', characterId: 1 }, { playerName: [], characterId: 1 },
  { playerName: 'Tomas', characterId: '1' }, { playerName: 'Tomas', characterId: 1.5 },
  { playerName: 'Tomas', characterId: 0 }, { playerName: 'Tomas', characterId: 999 }
])('rejects invalid moves with a consistent error: %j', async body => {
  await request(app).post('/api/game/create');
  const response = await request(app).post('/api/game/move').send(body).expect(400);
  expect(response.body.message).toEqual(expect.any(String));
});

test('returns JSON for malformed JSON and unknown API endpoints', async () => {
  await request(app).post('/api/game/create');
  const malformed = await request(app).post('/api/game/move')
    .set('Content-Type', 'application/json').send('{').expect(400);
  expect(malformed.body.message).toEqual(expect.any(String));
  const missing = await request(app).get('/api/missing').expect(404);
  expect(missing.body.message).toEqual(expect.any(String));
});

test('reports initialization errors and allows a later join to recover', async () => {
  const fs = require('fs');
  const images = jest.spyOn(fs, 'readdirSync').mockReturnValue([]);
  const log = jest.spyOn(console, 'error').mockImplementation(() => {});
  try {
    const failure = await request(app).post('/api/game/join').expect(500);
    expect(failure.body).toEqual({ message: 'Unable to load the game.' });
    await request(app).get('/api/game/state?playerName=Tomas').expect(404);
  } finally {
    images.mockRestore();
    log.mockRestore();
  }
  await request(app).post('/api/game/join').expect(200);
});
