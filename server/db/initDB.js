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

(async () => {
  const createRoutesTable = `
  CREATE TABLE IF NOT EXISTS routes (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    stops VARCHAR(7000) NOT NULL,
    generated_route VARCHAR(7000) NOT NULL,
    time VARCHAR(255) NOT NULL,
    distance VARCHAR(255) NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`;
  await execQuery(createRoutesTable, null);
})();
