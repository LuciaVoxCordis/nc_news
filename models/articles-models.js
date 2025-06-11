const db = require("../db/connection");

const requestAllArticles = async (sort_by, order) => {
  const sort_byWhitelist = [
    "created_at",
    "article_id",
    "votes",
    "comment_count",
  ];
  const orderWhitelist = ["DESC", "ASC"];

  let queryString =
    "SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::int AS comment_count FROM articles left JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY ";

  if (sort_by !== undefined && sort_byWhitelist.includes(sort_by)) {
    queryString += `articles.${sort_by} `;
  } else {
    queryString += "articles.created_at ";
  }
  if (order !== undefined && orderWhitelist.includes(order)) {
    queryString += order;
  } else {
    queryString += "DESC";
  }
  const { rows } = await db.query(queryString);
  return { rows };
};

const requestArticleById = async (article_id) => {
  const { rows } = await db.query(
    "SELECT * FROM articles WHERE article_id = $1",
    [article_id]
  );
  if (!rows.length) {
    return Promise.reject({ status: 404, msg: "not found" });
  }
  return { rows };
};

const requestCommentsByArticleId = async (article_id) => {
  const { rows } = await db.query(
    "SELECT * FROM comments WHERE article_id = $1",
    [article_id]
  );
  if (!rows.length) {
    return Promise.reject({ status: 404, msg: "not found" });
  }
  return { rows };
};

const requestPostComment = async (article_id, body, author) => {
  const { rows } = await db.query(
    "INSERT INTO comments (article_id, body, author) VALUES ($1, $2, $3) RETURNING *",
    [article_id, body, author]
  );
  return { rows };
};

const requestPatchArticleVotes = async (article_id, inc_votes) => {
  const { rows } = await db.query(
    "UPDATE articles SET votes = votes + $2::INT WHERE article_id = $1 RETURNING *",
    [article_id, inc_votes]
  );
  if (!rows.length) {
    return Promise.reject({ status: 404, msg: "not found" });
  }
  return { rows };
};

module.exports = {
  requestAllArticles,
  requestArticleById,
  requestCommentsByArticleId,
  requestPostComment,
  requestPatchArticleVotes,
};
