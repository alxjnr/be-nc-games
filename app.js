const express = require("express");
const app = express();
const { getCategories } = require("./controllers/controllers.categories");
const { getReviews } = require("./controllers/controllers.reviews");

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

module.exports = { app };
