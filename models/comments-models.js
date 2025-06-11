const db = require("../db/connection");

const requestDeleteComment = async (comment_id) => {
  const { rows } = await db.query(
    "DELETE FROM comments where comment_id = $1 RETURNING *",
    [comment_id]
  );
  if (!rows.length) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
};

module.exports = requestDeleteComment;
