const {
  fetchReviewById,
  fetchReviews,
  insertReviewComment,
  fetchCommentsByReviewId,
  updateReview,
} = require("../models/models.reviews");

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (req, res, next) => {
  fetchReviews()
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};

exports.postReviewComment = (req, res, next) => {
  const { username, body } = req.body;
  const { review_id } = req.params;
  insertReviewComment(username, body, review_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  const IdCheck = fetchReviewById(review_id);
  const comments = fetchCommentsByReviewId(review_id);

  Promise.all([IdCheck, comments])
    .then((values) => {
      res.status(200).send({ comments: values[1] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchReviewById = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  updateReview(review_id, inc_votes)
    .then((review) => {
      res.status(201).send({ review: review.rows });
    })
    .catch((err) => {
      next(err);
    });
};
