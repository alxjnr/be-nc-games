const { fetchUsers } = require("../models/models.users.js");

exports.getUsers = (req, res, next) => {
  fetchUsers().then((users) => {
    // console.log(users.rows);
    res.status(200).send({ users });
  });
};
