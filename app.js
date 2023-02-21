const express = require("express");
const app = express();
const { getCategories } = require("./controllers/controllers.categories");
const {
  getReviewById,
  getReviews,
  postReviewComment,
  getCommentsByReviewId,
  patchReviewById,
} = require("./controllers/controllers.reviews");
const { getUsers } = require("./controllers/controllers.users");

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById);

app.get("/api/reviews", getReviews);

app.post("/api/reviews/:review_id/comments", postReviewComment);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

app.get("/api/users", getUsers);

app.patch("/api/reviews/:review_id", patchReviewById);

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "42703" || err.code === "23502") {
    res.status(400).send("Invalid type for request");
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send("ID not found");
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

app.use((err, req, res, next) => {
  res.status(500).send(err);
});

module.exports = { app };
