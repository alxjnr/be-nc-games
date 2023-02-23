const { fetchApiEndpoints } = require("../models/models.api");

exports.getApiEndpoints = (req, res, next) => {
  fetchApiEndpoints()
    .then((endpoints) => {
      res.status(200).send(endpoints);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
