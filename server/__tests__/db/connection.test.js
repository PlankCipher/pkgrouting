require('mysql2/node_modules/iconv-lite').encodingExists('foo');
const execQuery = require('../../db/execQuery.js');
const {
  host,
  database,
  port,
  user,
  password,
} = require('../../db/connectionConfig.js');

describe('Connection', () => {
  test('All necessary connection variables are defined', () => {
    expect(host).toBeDefined();
    expect(database).toBeDefined();
    expect(port).toBeDefined();
    expect(user).toBeDefined();
    expect(password).toBeDefined();
  });
});

describe('execQuery()', () => {
  test('execQuery() is defined', () => {
    expect(execQuery).toBeDefined();
  });

  test("execQuery('SELECT 1 + 1 AS sum', null) returns a row called sum with the value 2", async () => {
    expect.assertions(1);

    const [result] = await execQuery('SELECT 1 + 1 AS sum', null);

    expect(result).toEqual([{ sum: 2 }]);
  });

  test("execQuery('SELECT 1 + ? AS sum', [2]) returns a row called sum with the value 3", async () => {
    expect.assertions(1);

    const [result] = await execQuery('SELECT 1 + ? AS sum', [2]);

    expect(result).toEqual([{ sum: 3 }]);
  });
});
