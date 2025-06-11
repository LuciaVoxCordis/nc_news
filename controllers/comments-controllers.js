const requestDeleteComment = require("../models/comments-models");

const deleteComment = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    await requestDeleteComment(comment_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = deleteComment;
