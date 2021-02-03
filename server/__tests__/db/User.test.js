const execQuery = require('../../db/execQuery.js');
const User = require('../../db/User.js');

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

describe('findByName()', () => {
  test('findByName() is defined', () => {
    expect(User.findByName).toBeDefined();
  });

  test("findByName('somename') returns id, name, and hashed password of the user with the name 'somename' if exists.", async () => {
    expect.assertions(1);

    const expectedUser = {
      id: expect.any(Number),
      name: 'somename',
      password: expect.any(String),
    };

    const [result] = await execQuery(
      "INSERT INTO users (name, password) VALUES ('somename', 'password')",
      null,
    );

    const { user } = await User.findByName('somename');

    expect(user).toEqual(expectedUser);

    await execQuery('DELETE FROM users WHERE id = ?', [result.insertId]);
  });

  test("findByName('somename') returns an error with status code 404 if user not found", async () => {
    expect.assertions(1);

    const expectedError = {
      statusCode: 404,
    };

    const { err } = await User.findByName('somename');

    expect(err).toEqual(expect.objectContaining(expectedError));
  });
});

describe('findOrCreate()', () => {
  test('findOrCreate() is defined', () => {
    expect(User.findOrCreate).toBeDefined();
  });

  test("findOrCreate('somename', 'password') adds a user to the database and returns its id and name if name is not taken", async () => {
    expect.assertions(1);

    const expectedUser = {
      id: expect.any(Number),
      name: 'somename',
    };

    const { user } = await User.findOrCreate('somename', 'password');

    expect(user).toEqual(expect.objectContaining(expectedUser));

    await execQuery('DELETE FROM users WHERE id = ?', [user.id]);
  });

  test("findOrCreate('somename', 'password') inserts a hashed password to the database", async () => {
    expect.assertions(1);

    const { user: createdUser } = await User.findOrCreate(
      'somename',
      'password',
    );

    const { user: retrievedUser } = await User.findByName('somename');

    expect(retrievedUser.password).not.toBe('password');

    await execQuery('DELETE FROM users WHERE id = ?', [createdUser.id]);
  });

  test("findOrCreate('somename', 'password') returns an error with status code 409 if name already taken", async () => {
    expect.assertions(1);

    const [result] = await execQuery(
      "INSERT INTO users (name, password) VALUES ('somename', 'password')",
      null,
    );

    const expectedError = {
      statusCode: 409,
    };

    const { err } = await User.findOrCreate('somename');

    expect(err).toEqual(expect.objectContaining(expectedError));

    await execQuery('DELETE FROM users WHERE id = ?', [result.insertId]);
  });
});
