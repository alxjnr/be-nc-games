const db = require("../db/connection.js");

exports.fetchReviews = () => {
  const reviewQuery = db.query(
    `SELECT * FROM reviews ORDER BY created_at DESC;`
  );
  const commentQuery = db.query(`SELECT * FROM comments;`);
  return Promise.all([reviewQuery, commentQuery]).then((values) => {
    const reviews = values[0].rows;
    const comments = values[1].rows;
    const reviewArr = [];
    reviews.forEach((review) => {
      const reviewClone = { ...review };
      reviewClone.comment_count = 0;
      for (let comment of comments) {
        if (comment.review_id === review.review_id)
          reviewClone.comment_count += 1;
      }
      reviewArr.push(reviewClone);
    });
    return reviewArr;
  });
};
