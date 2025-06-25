const {
  requestAllArticles,
  requestArticleById,
  requestCommentsByArticleId,
  requestPostComment,
  requestPatchArticleVotes,
  requestArticlesByTopic,
} = require("../models/articles-models");
const { extractQueries } = require("./controllers-utils");

const getAllArticles = async (req, res) => {
  if (Object.keys(req.query).length) {
    const { query } = req.query;
    const { sort_by, order } = extractQueries("sort_by", "order", query);
    const { rows } = await requestAllArticles(sort_by, order);
    res.status(200).send({ articles: rows });
  } else {
    const { rows } = await requestAllArticles();
    res.status(200).send({ articles: rows });
  }
};

const getArticleById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const { rows } = await requestArticleById(article_id);
    res.status(200).send(rows[0]);
  } catch (err) {
    next(err);
  }
};

const getArticlesByTopic = async (req, res, next) => {
  try {
    const { topic } = req.params;
    const { rows } = await requestArticlesByTopic(topic);
    res.status(200).send({ articles: rows });
  } catch (err) {
    next(err);
  }
};

const getCommentsByArticleId = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const { rows } = await requestCommentsByArticleId(article_id);
    res.status(200).send({ comments: rows });
  } catch (err) {
    next(err);
  }
};

const postComment = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const { body, author } = req.body;
    const { rows } = await requestPostComment(article_id, body, author);
    res.status(201).send(rows[0]);
  } catch (err) {
    next(err);
  }
};

const patchArticleVotes = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    const { rows } = await requestPatchArticleVotes(article_id, inc_votes);
    res.status(202).send(rows[0]);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllArticles,
  getArticleById,
  getArticlesByTopic,
  getCommentsByArticleId,
  postComment,
  patchArticleVotes,
};
