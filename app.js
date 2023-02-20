const express = require("express");
const app = express();
const { getCategories } = require("./controllers/controllers.categories");
const { getReviewById } = require("./controllers/controllers.reviews");

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
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
