'use strict';

function createTowerClient(env = process.env, request = fetch) {
  for (const name of ['TOWER_API_URL', 'TOWER_CLIENT_ID', 'TOWER_CLIENT_SECRET']) {
    if (typeof env[name] !== 'string' || !env[name].trim()) throw new Error(`${name} is required`);
  }
  const base = new URL(env.TOWER_API_URL);
  if (base.protocol !== 'https:' || base.username || base.password ||
      base.search || base.hash || base.pathname !== '/') {
    throw new Error('TOWER_API_URL must be an HTTPS origin without credentials, path, or query');
  }

  async function post(path, body, token) {
    const response = await request(new URL(path, base), {
      method: 'POST',
      redirect: 'error',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(90_000),
    });
    if (!response.ok) throw new Error(`${path} failed: HTTP ${response.status}`);
    return response.json();
  }

  return {
    async dispatch(path, body) {
      const login = await post('/api/auth/token', {
        clientId: env.TOWER_CLIENT_ID,
        clientSecret: env.TOWER_CLIENT_SECRET,
      });
      if (typeof login?.token !== 'string' || !login.token.trim()) {
        throw new Error('Login returned no token');
      }
      return post(path, body, login.token);
    },
  };
}

module.exports = { createTowerClient };
