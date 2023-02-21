const db = require("../db/connection");
const format = require("pg-format");

exports.fetchReviewById = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
    .then((res) => {
      if (!res.rows.length) {
        return Promise.reject({
          status: 404,
          msg: `No review found for review_id ${review_id}`,
        });
      }
      return res.rows;
    });
};

exports.fetchReviews = (
  category = "",
  sort_by = "created_at",
  order = "DESC"
) => {
  let categoryAdd = "";

  if (category.length) {
    categoryAdd = `WHERE category LIKE '%${category}%'`;
  }

  let queryStr = `SELECT reviews.*, COUNT(comments.review_id) AS comment_count FROM reviews 
  LEFT JOIN comments 
  ON reviews.review_id = comments.review_id ${categoryAdd}
  GROUP BY reviews.review_id 
  ORDER BY reviews.${sort_by} ${order};`;

  return db.query(queryStr).then((res) => {
    if (!res.rows.length) {
      return Promise.reject({
        status: 404,
        msg: `No category found`,
      });
    }
    return res.rows;
  });
};

exports.insertReviewComment = (username, body, review_id) => {
  const arr = [[body, 0, username, review_id, new Date()]];
  const insertObj = format(
    `INSERT INTO comments (body, votes, author, review_id, created_at) VALUES %L RETURNING *;`,
    arr
  );

  return db.query(insertObj).then((res) => {
    return res.rows[0];
  });
};

exports.fetchCommentsByReviewId = (review_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE review_id = ${review_id} ORDER BY comments.created_at DESC`
    )
    .then((res) => {
      return res.rows;
    });
};

exports.updateReview = (review_id, inc_votes) => {
  let countValue = format(
    `UPDATE reviews SET votes = votes + ${inc_votes} WHERE review_id = ${review_id} RETURNING *;`
  );
  return db.query(countValue).then((values) => {
    if (!values.rows.length) {
      return Promise.reject({
        status: 404,
        msg: `No review found for review_id ${review_id}`,
      });
    }
    return values;
  });
};
