const express = require("express");
const app = express();
const { getCategories } = require("./controllers/controllers.categories");
const {
  getReviewById,
  getReviews,
  getCommentsByReviewId,
  patchReviewById,
} = require("./controllers/controllers.reviews");

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

app.patch("/api/reviews/:review_id", patchReviewById);

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "42703") {
    res.status(400).send("Invalid type for request");
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send(err.msg);
  } else {
    next(err);
  }
});

module.exports = { app };
