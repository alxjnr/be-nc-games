const { fetchReviews } = require("../models/models.reviews.js");

exports.getReviews = (req, res) => {
  fetchReviews().then((reviews) => {
    res.status(200).send({ reviews });
  });
};
