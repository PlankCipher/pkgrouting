const fetch = require('node-fetch');
const User = require('../../db/User.js');
const execQuery = require('../../db/execQuery.js');

const API_URL = 'http://localhost:5000';

// TODO: when refactoring, consider extracting the repetitive operations
// TODO: to functions in utils dir
describe('users table in test database', () => {
  test('users table is empty', async () => {
    expect.assertions(1);

    const [result] = await execQuery(
      'SELECT COUNT(*) AS count FROM users',
      null,
    );

    expect(result[0].count).toBe(0);
  });
});

describe(`${API_URL}/auth/current`, () => {
  test('GET@/auth/current returns a response with a 403 status code when not logged in', async () => {
    expect.assertions(1);

    const res = await fetch(`${API_URL}/auth/current`);

    expect(res.status).toBe(403);
  });

  test('GET@/auth/current returns the id and name of currently logged in user', async () => {
    expect.assertions(1);

    const nameToCreate = 'somename';
    const password = 'somepassword';

    const {
      user: { id, name },
    } = await User.findOrCreate(nameToCreate, password);

    const { headers } = await fetch(`${API_URL}/auth/login`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ name: nameToCreate, password }),
    });

    const res = await fetch(`${API_URL}/auth/current`, {
      headers: {
        cookie: headers.get('set-cookie'),
      },
    });
    const currentUser = await res.json();

    const expectedUser = { id, name };

    expect(currentUser).toEqual(expectedUser);

    await fetch(`${API_URL}/auth/logout`, {
      headers: { cookie: headers.get('set-cookie') },
      method: 'POST',
    });
    await execQuery('DELETE FROM users WHERE id = ?', [id]);
  });
});

describe(`${API_URL}/auth/signup`, () => {
  test('POST@/auth/signup with JSON body of name and password adds a user to the database and responds with its data and a 201 status code', async () => {
    expect.assertions(3);

    const name = 'somename';
    const password = 'somepassword';

    const res = await fetch(`${API_URL}/auth/signup`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ name, password }),
    });

    const receivedUser = await res.json();
    const expectedUser = {
      id: expect.any(Number),
      name,
    };
    const { user: retrievedUser } = await User.findByName(name);

    expect(res.status).toBe(201);
    expect(receivedUser).toEqual(expectedUser);
    expect(retrievedUser).toEqual(expect.objectContaining(receivedUser));

    await execQuery('DELETE FROM users WHERE id = ?', [receivedUser.id]);
  });
});

describe(`${API_URL}/auth/login`, () => {
  test('POST@/auth/login with JSON body of name and password responds with a 204 status code and puts the logged in user data into session', async () => {
    expect.assertions(2);

    const nameToCreate = 'somename';
    const password = 'somepassword';

    const {
      user: { id, name },
    } = await User.findOrCreate(nameToCreate, password);

    const logInRes = await fetch(`${API_URL}/auth/login`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ name: nameToCreate, password }),
    });
    const logInCookie = logInRes.headers.get('set-cookie');

    const currentRes = await fetch(`${API_URL}/auth/current`, {
      headers: {
        cookie: logInCookie,
      },
    });
    const currentUser = await currentRes.json();

    const expectedUser = { id, name };

    expect(logInRes.status).toBe(204);
    expect(currentUser).toEqual(expectedUser);

    await fetch(`${API_URL}/auth/logout`, {
      headers: { cookie: logInCookie },
      method: 'POST',
    });
    await execQuery('DELETE FROM users WHERE id = ?', [id]);
  });

  // TODO: add a test for incorrect credentials

  test('POST@/auth/login responds with a 403 status code if already logged in', async () => {
    expect.assertions(1);

    const name = 'somename';
    const password = 'somepassword';

    const {
      user: { id },
    } = await User.findOrCreate(name, password);

    const { headers } = await fetch(`${API_URL}/auth/login`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ name, password }),
    });
    const logInCookie = headers.get('set-cookie');

    const res = await fetch(`${API_URL}/auth/login`, {
      headers: {
        'Content-Type': 'application/json',
        cookie: logInCookie,
      },
      method: 'POST',
      body: JSON.stringify({ name, password }),
    });

    expect(res.status).toBe(403);

    await fetch(`${API_URL}/auth/logout`, {
      headers: { cookie: logInCookie },
      method: 'POST',
    });
    await execQuery('DELETE FROM users WHERE id = ?', [id]);
  });
});

describe(`${API_URL}/auth/logout`, () => {
  test('POST@/auth/logout responds with a 200 status code and removes user data from session', async () => {
    expect.assertions(2);

    const name = 'somename';
    const password = 'somepassword';

    const {
      user: { id },
    } = await User.findOrCreate(name, password);

    const { headers } = await fetch(`${API_URL}/auth/login`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ name, password }),
    });

    const logOutRes = await fetch(`${API_URL}/auth/logout`, {
      headers: { cookie: headers.get('set-cookie') },
      method: 'POST',
    });

    const currentUserRes = await fetch(`${API_URL}/auth/current`, {
      headers: { cookie: headers.get('set-cookie') },
    });

    expect(logOutRes.status).toBe(200);
    expect(currentUserRes.status).toEqual(403);

    await execQuery('DELETE FROM users WHERE id = ?', [id]);
  });

  test('POST@/auth/logout responds with a 403 status code if not logged in', async () => {
    expect.assertions(1);

    const res = await fetch(`${API_URL}/auth/logout`, { method: 'POST' });

    expect(res.status).toBe(403);
  });
});
