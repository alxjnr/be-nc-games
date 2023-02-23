const db = require("../db/connection");
const fs = require("fs/promises");

exports.fetchApiEndpoints = () => {
  return fs.readFile("endpoints.json", "utf-8").then((data, err) => {
    const parsedBody = JSON.parse(data);
    return parsedBody;
  });
};
