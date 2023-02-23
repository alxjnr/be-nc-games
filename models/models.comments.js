const db = require("../db/connection");
const format = require("pg-format");

exports.removeCommentById = (comment_id) => {
  const values = [comment_id];
  const validIdCheck = format(`SELECT * FROM comments WHERE comment_id = $1`);
  return db.query(validIdCheck, values).then((res) => {
    if (!res.rows.length) {
      return Promise.reject({
        status: 404,
        msg: `No comment found for comment_id ${comment_id}`,
      });
    } else {
      const deleteQuery = format(`DELETE FROM comments WHERE comment_id = $1;`);
      return db.query(deleteQuery, values).then((res) => {
        return res;
      });
    }
  });
};
