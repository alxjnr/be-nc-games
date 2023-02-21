const db = require("../db/connection");

exports.fetchUsers = (s) => {
  return db.query(`SELECT * FROM users`).then((res) => {
    return res;
  });
};
