const db = require("../../db/connection");

function convertTimestampToDate({ created_at, ...otherProperties }) {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
}

async function createRefObj(dbToQuery, key, value) {
  const { rows } = await db.query(`SELECT ${key}, ${value} from ${dbToQuery}`);
  const refObj = {};
  rows.forEach((row) => {
    refObj[row[key]] = row[value];
  });
  return refObj;
}

function convertToID(refObj, dataArr, key) {
  const newDataArr = dataArr.map((obj) => {
    const objCopy = { ...obj };
    objCopy[key] = refObj[obj[key]];
    return objCopy;
  });
  return newDataArr;
}

module.exports = { convertTimestampToDate, createRefObj, convertToID };
