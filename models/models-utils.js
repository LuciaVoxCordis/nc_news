const db = require("../db/connection");

const requestExists = async (table, id, value) => {
  const { rows } = await db.query(
    `SELECT * FROM ${table} WHERE ${id} = ${value}`
  );
  if (rows.length) {
    return true;
  }
  return false;
};

module.exports = requestExists;
