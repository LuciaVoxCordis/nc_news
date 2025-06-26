const {
  requestDeleteComment,
  requestPatchCommentVotes,
} = require("../models/comments-models");

const patchCommentVotes = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    const { rows } = await requestPatchCommentVotes(comment_id, inc_votes);
    res.status(202).send(rows[0]);
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    await requestDeleteComment(comment_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { deleteComment, patchCommentVotes };
