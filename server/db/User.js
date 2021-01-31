const bcrypt = require('bcrypt');
const execQuery = require('./execQuery.js');

class User {
  static async findOrCreate(username, password) {
    try {
      // eslint-disable-next-line
      const findUserSQL =
        'SELECT * FROM users WHERE name = CONVERT(? USING utf8mb4) COLLATE utf8mb4_bin';
      const [findUserResult] = await execQuery(findUserSQL, [username]);

      if (findUserResult.length === 0) {
        const passwordHash = await bcrypt.hash(password, 10);

        // eslint-disable-next-line
        const insertUserSQL =
          'INSERT INTO users (name, password) VALUES (?, ?)';

        await execQuery(insertUserSQL, [username, passwordHash]);
      } else {
        const err = new Error(
          `User with the username ${username} already exists.`,
        );
        err.statusCode = 409;
        throw err;
      }

      const { err, user } = await User.findByUsername(username);

      return { err, user };
    } catch (err) {
      return { err, user: null };
    }
  }

  static async findByUsername(username) {
    try {
      // eslint-disable-next-line
      const findUserSQL =
        'SELECT * FROM users WHERE name = CONVERT(? USING utf8mb4) COLLATE utf8mb4_bin';

      const [findUserResult] = await execQuery(findUserSQL, [username]);

      if (findUserResult.length < 1) {
        const err = new Error(
          `User with the username ${username} was not found.`,
        );
        err.statusCode = 404;
        throw err;
      }

      return { err: null, user: findUserResult[0] };
    } catch (err) {
      return { err, user: null };
    }
  }
}

module.exports = User;