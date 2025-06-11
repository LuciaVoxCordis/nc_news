const db = require("../db/connection");

const requestAllUsers = async () => {
  const { rows } = await db.query("SELECT * FROM users");
  return { rows };
};

module.exports = requestAllUsers;
