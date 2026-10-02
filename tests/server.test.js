const { spawn } = require('child_process');
const path = require('path');

test('the standalone server is reachable through localhost', async () => {
  const server = spawn(process.execPath, [path.join(__dirname, '../server/index.js')], {
    env: { ...process.env, PORT: '0' }
  });
  try {
    const output = await new Promise((resolve, reject) => {
      server.stdout.once('data', data => resolve(data.toString()));
      server.once('error', reject);
      server.once('exit', code => reject(new Error(`Server exited: ${code}`)));
    });
    expect(output).toMatch(/http:\/\/localhost:\d+/);
    const url = output.match(/http:\/\/localhost:\d+/)[0];
    const response = await fetch(url);
    expect(response.status).toBe(200);
    expect(await response.text()).toContain('Play as Nora');
  } finally {
    server.kill();
  }
});
