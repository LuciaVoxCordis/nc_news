const db = require("../db/connection");

const requestGetAll = async (table) => {
  const { rows } = await db.query("SELECT * from $1", [table]);
  return { rows };
};

const requestGetSpecific = async (table, column, value) => {
  console.log([table, column, value]);
  const { rows } = await db.query("SELECT * FROM $1 WHERE $2 = $3", [
    table,
    column,
    value,
  ]);
  console.log(rows);
  if (!rows.length) {
    return Promise.reject({ status: 404, msg: "not found" });
  }
  return { rows };
};

module.exports = { requestGetAll, requestGetSpecific };
