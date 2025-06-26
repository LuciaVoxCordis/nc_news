const db = require("../db/connection");

const requestPatchCommentVotes = async (comment_id, inc_votes) => {
  const { rows } = await db.query(
    "UPDATE comments SET votes = votes + $2::INT WHERE comment_id = $1 RETURNING *",
    [comment_id, inc_votes]
  );
  if (!rows.length) {
    return Promise.reject({ status: 404, msg: "not found" });
  }
  return { rows };
};

const requestDeleteComment = async (comment_id) => {
  const { rows } = await db.query(
    "DELETE FROM comments where comment_id = $1 RETURNING *",
    [comment_id]
  );
  if (!rows.length) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
};

module.exports = { requestDeleteComment, requestPatchCommentVotes };
