const db = require("../db/connection");

const requestAllTopics = async () => {
  const { rows } = await db.query("SELECT * FROM topics");
  return { rows };
};

module.exports = requestAllTopics;
