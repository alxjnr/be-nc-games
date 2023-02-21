const {
  fetchReviewById,
  fetchReviews,
  fetchCommentsByReviewId,
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
