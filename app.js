const express = require("express");
const db = require("./db/connection");
const getAllUsers = require("./controllers/users-controllers");
const getAllTopics = require("./controllers/topics-controllers");
const {
  getAllArticles,
  getArticleById,
  getCommentsByArticleId,
  postComment,
  patchArticleVotes,
} = require("./controllers/articles-controllers");
const {
  handlePostgresErrors,
  handleCustomErrors,
  handleOtherErrors,
} = require("./error-handling");
const deleteComment = require("./controllers/comments-controllers");

const app = express();

//app.use()

//app.use(express.static("public"));

app.use(express.json());

app.use("/api", express.static("public"));

app.get("/api/users", getAllUsers);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

app.delete("/api/comments/:comment_id", deleteComment);

app.use(handleCustomErrors);

app.use(handlePostgresErrors);

app.use(handleOtherErrors);

module.exports = app;
