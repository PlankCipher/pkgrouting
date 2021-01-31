const execQuery = require('../../db/execQuery.js');
const User = require('../../db/User.js');

describe('users table in test database', () => {
  test('users table is empty', async () => {
    expect.assertions(1);

    const [result] = await execQuery(
      'SELECT COUNT(*) AS count FROM users',
      null,
    );

    expect(result[0].count).toEqual(0);
  });
});

describe('findByUsername()', () => {
  test('findByUsername() is defined', () => {
    expect(User.findByUsername).toBeDefined();
  });

  test("findByUsername('someusername') returns id, username, and hashed password of the user with the username 'someusername' if exists.", async () => {
    expect.assertions(1);

    const expectedUser = {
      id: expect.any(Number),
      name: 'someusername',
      password: expect.any(String),
    };

    const [result] = await execQuery(
      "INSERT INTO users (name, password) VALUES ('someusername', 'password')",
      null,
    );

    const { user } = await User.findByUsername('someusername');

    expect(user).toEqual(expectedUser);

    await execQuery('DELETE FROM users WHERE id = ?', [result.insertId]);
  });

  test("findByUsername('someusername') returns an error with status code 404 if user not found", async () => {
    expect.assertions(1);

    const expectedError = {
      statusCode: 404,
    };

    const { err } = await User.findByUsername('someusername');

    expect(err).toEqual(expect.objectContaining(expectedError));
  });
});

describe('findOrCreate()', () => {
  test('findOrCreate() is defined', () => {
    expect(User.findOrCreate).toBeDefined();
  });

  test("findOrCreate('someusername', 'password') adds a user to the database and returns its id and username if username is not taken", async () => {
    expect.assertions(1);

    const expectedUser = {
      id: expect.any(Number),
      name: 'someusername',
    };

    const { user } = await User.findOrCreate('someusername', 'password');

    expect(user).toEqual(expect.objectContaining(expectedUser));

    await execQuery('DELETE FROM users WHERE id = ?', [user.id]);
  });

  test("findOrCreate('someusername', 'password') inserts a hashed password to the database", async () => {
    expect.assertions(1);

    const { user: createdUser } = await User.findOrCreate(
      'someusername',
      'password',
    );

    const { err, user: retrievedUser } = await User.findByUsername(
      'someusername',
    );

    if (err) throw err;

    expect(retrievedUser.password).not.toBe('password');

    await execQuery('DELETE FROM users WHERE id = ?', [createdUser.id]);
  });

  test("findOrCreate('someusername', 'password') returns an error with status code 409 if username already taken", async () => {
    expect.assertions(1);

    const [result] = await execQuery(
      "INSERT INTO users (name, password) VALUES ('someusername', 'password')",
      null,
    );

    const expectedError = {
      statusCode: 409,
    };

    const { err } = await User.findOrCreate('someusername');

    expect(err).toEqual(expect.objectContaining(expectedError));

    await execQuery('DELETE FROM users WHERE id = ?', [result.insertId]);
  });
});
