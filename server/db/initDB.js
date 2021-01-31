const execQuery = require('./execQuery.js');

(async () => {
  const createUsersTableSql = `
  CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY(id)
  )`;
  await execQuery(createUsersTableSql, null);
})();
