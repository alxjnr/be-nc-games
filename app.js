const express = require("express");
const app = express();
const cors = require("cors");
const { getCategories } = require("./controllers/controllers.categories");
const {
  getReviewById,
  getReviews,
  postReviewComment,
  getCommentsByReviewId,
  patchReviewById,
} = require("./controllers/controllers.reviews");
const { getUsers } = require("./controllers/controllers.users");
const { getApiEndpoints } = require("./controllers/controllers.api");
const { deleteCommentById } = require("./controllers/controllers.comments");

// cors

app.use(cors());

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById);

app.get("/api/reviews", getReviews);

app.post("/api/reviews/:review_id/comments", postReviewComment);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

app.get("/api/users", getUsers);

app.patch("/api/reviews/:review_id", patchReviewById);

app.get("/api", getApiEndpoints);
app.delete("/api/comments/:comment_id", deleteCommentById);

app.use((err, req, res, next) => {
  if (
    err.code === "22P02" ||
    err.code === "42703" ||
    err.code === "23502" ||
    err.code === "42601"
  ) {
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
