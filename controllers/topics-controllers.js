const requestAllTopics = require("../models/topics-models");

const getAllTopics = async (req, res) => {
  const { rows } = await requestAllTopics();
  res.status(200).send({ topics: rows });
};

module.exports = getAllTopics;
