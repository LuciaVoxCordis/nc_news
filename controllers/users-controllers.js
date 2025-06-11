const requestAllUsers = require("../models/users-models");

const getAllUsers = async (req, res) => {
  const { rows } = await requestAllUsers();
  res.status(200).send({ users: rows });
};

module.exports = getAllUsers;
