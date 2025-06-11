//const { Pool } = require("pg");
//
//const ENV = process.env.NODE_ENV || "development";
//
//require("dotenv").config({ path: `${__dirname}/../.envs/.env.${ENV}` });
//
////const db = new Pool();
//
//if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
//  throw new Error("PGDATABASE or DATABASE_URL not set");
//}
//
//const config = {};
//
//if (ENV === "production") {
//  config.connectionString = process.env.DATABASE_URL;
//  config.max = 2;
//}
//module.exports = new Pool(config);
//
////module.exports = db;

const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || "development";

const config = {};
require("dotenv").config({ path: `${__dirname}/../.envs/.env.${ENV}` });
if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("No PGDATABASE configured");
} else {
  console.log(`Connected to ${process.env.PGDATABASE || "production env"}`);
}
const db = new Pool(config);

module.exports = db;
