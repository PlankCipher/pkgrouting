const fetch = require('node-fetch');
const execQuery = require('../../db/execQuery.js');
const User = require('../../db/User.js');
require('dotenv').config();

const { API_URL } = process.env;

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

describe(`${API_URL}/users/:userId`, () => {
  test('GET@/users/:userId responds with a 403 status code and no user data when not logged in', async () => {
    expect.assertions(2);

    const res = await fetch(`${API_URL}/users/1`);
    const data = await res.json();
    const { status: statusCode } = res;

    const nonExpectedData = {
      id: expect.anything(),
      name: expect.anything(),
    };

    expect(statusCode).toBe(403);
    expect(data).not.toEqual(expect.objectContaining(nonExpectedData));
  });

  test('GET@/users/:userId responds with a 403 status code and no user data when requesting data of a user other than the currently logged in one', async () => {
    expect.assertions(2);

    const name = 'somename';
    const password = 'somepassword';

    const otherName = 'someothername';
    const otherPassword = 'someotherpassword';

    const {
      user: { id },
    } = await User.findOrCreate(name, password);
    const {
      user: { id: otherId },
    } = await User.findOrCreate(otherName, otherPassword);

    const { headers } = await fetch(`${API_URL}/auth/login`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ name, password }),
    });
    const logInCookie = headers.get('set-cookie');

    const res = await fetch(`${API_URL}/users/${otherId}`, {
      headers: {
        cookie: logInCookie,
      },
    });
    const data = res.json();
    const { status: statusCode } = res;

    const nonExpectedData = {
      id: expect.anything(),
      name: expect.anything(),
    };

    expect(statusCode).toBe(401);
    expect(data).not.toEqual(expect.objectContaining(nonExpectedData));

    await fetch(`${API_URL}/auth/logout`, {
      headers: { cookie: logInCookie },
      method: 'POST',
    });
    await execQuery('DELETE FROM users WHERE id = ? OR id = ?', [id, otherId]);
  });

  test("GET@/users/:userId responds with a 200 status code and user data for the user with that id if it's the currently logged in user", async () => {
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
    const logInCookie = headers.get('set-cookie');

    const res = await fetch(`${API_URL}/users/${id}`, {
      headers: {
        cookie: logInCookie,
      },
    });
    const data = await res.json();
    const { status: statusCode } = res;

    const expectedUser = { id, name };

    expect(statusCode).toBe(200);
    expect(data).toEqual(expectedUser);

    await fetch(`${API_URL}/auth/logout`, { headers: { cookie: logInCookie } });
    await execQuery('DELETE FROM users WHERE id = ?', [id]);
  });
});
