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
  getArticlesByTopic,
} = require("./controllers/articles-controllers");
const {
  handlePostgresErrors,
  handleCustomErrors,
  handleOtherErrors,
} = require("./error-handling");
const {
  deleteComment,
  patchCommentVotes,
} = require("./controllers/comments-controllers");
const cors = require("cors");

const app = express();

//app.use()

//app.use(express.static("public"));

app.use(cors());

app.use(express.json());

app.use("/api", express.static("public"));

app.get("/api/users", getAllUsers);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/topics/:topic", getArticlesByTopic);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/comments/:comment_id", patchCommentVotes);

app.delete("/api/comments/:comment_id", deleteComment);

app.use(handleCustomErrors);

app.use(handlePostgresErrors);

app.use(handleOtherErrors);

module.exports = app;
