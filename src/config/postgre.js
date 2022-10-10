const { Pool } = require("pg");

const db = new Pool({
  host: "localhost",
  user: "rofa",
  database: "sakaCoffe",
  password: "adekbaik99",
  port: 5432,
});

module.exports = db;
