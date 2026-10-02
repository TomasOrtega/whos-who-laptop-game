# Who’s Who? Laptop Game

A two-player game for Tomas and Nora, served over a local network with Node.js and Express.

## Play locally

Use Node.js 24 or later:

```sh
npm ci
npm start
```

Open http://localhost:3000 on the server's computer. On another computer on the same network, use the local-network URL printed by the server. Set `PORT` to use a different port.

Each player selects their name to join the same game. Opening or reloading a browser preserves the current game. Progress lives in memory and is lost when the server stops.

Your board contains your character images, and your mystery card comes from the other player's board. Ask each other yes/no questions and flip cards on your own board to deduce your opponent's mystery. There is no automatic guess checker.

**New game** resets both players' boards and chooses new mysteries. Open browsers refresh every five seconds.

## Character images

Add images to `client/images/tomas/` or `client/images/nora/`. Supported formats are PNG, JPEG, GIF, SVG, and WebP. Filenames without extensions become character names. Each folder needs at least one image; restart the game to reload changes.

## Development

```sh
npm test
npm run doc
```

Tests cover the game model, HTTP API, browser interactions, and standalone server startup. JSDoc generates the documentation in `docs/`.

`npm run build:exe` packages the server and client as a Windows x64 executable in `dist/`, using Node.js 24. The executable serves the same local-network game.

## HTTP API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/game/join` | Create a game if none exists; otherwise preserve it. |
| POST | `/api/game/create` | Reset the shared game. |
| GET | `/api/game/state?playerName=Tomas` | Get a player's board and mystery. |
| GET | `/api/game/state/player/Nora` | Get the same state using a path parameter. |
| POST | `/api/game/move` | Toggle a character with JSON `{"playerName":"Tomas","characterId":1}`. |

Player names are exactly `Tomas` or `Nora`. Errors return JSON with a `message` field. Moves return the character's new `isGrayedOut` value.

## CI and GitHub Pages

GitHub Actions installs the locked dependencies with `npm ci`, runs tests, and builds documentation on pull requests and pushes to `main`. Successful builds on `main` publish the documentation to GitHub Pages. Manual runs on `main` can also publish it.

In the repository's **Settings → Pages**, select **GitHub Actions** as the publishing source. Pages hosts the generated documentation; the game runs through the Node.js server.

Dependabot checks npm dependencies and GitHub Actions weekly. Commit `package-lock.json` when updating dependencies.
