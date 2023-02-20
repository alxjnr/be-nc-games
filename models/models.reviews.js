const db = require("../db/connection");

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
