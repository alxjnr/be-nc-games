const {
  fetchReviewById,
  fetchReviews,
  insertReviewComment,
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
      // console.log({ review });
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
