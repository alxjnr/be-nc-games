const express = require("express");
const app = express();
const { getCategories } = require("./controllers/controllers.categories");
const { getReviews } = require("./controllers/controllers.reviews");

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = { app };
