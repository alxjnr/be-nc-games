const db = require("../db/connection.js");

exports.fetchReviews = () => {
  return db
    .query(
      `SELECT reviews.*, COUNT(comments.review_id) AS comment_count FROM reviews 
      LEFT JOIN comments 
      ON reviews.review_id = comments.review_id 
      GROUP BY reviews.review_id 
      ORDER BY reviews.created_at DESC;`
    )
    .then((res) => {
      return res.rows;
    });
};
