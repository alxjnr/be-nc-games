const { app } = require("../app.js");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const connection = require("../db/connection");
const data = require("../db/data/test-data/index");
const { expect } = require("@jest/globals");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  connection.end();
});

describe("API Testing", () => {
  describe("/api/categories", () => {
    describe("GET Requests", () => {
      test("GET /api/categories should return a status code of 200", () => {
        return request(app).get("/api/categories").expect(200);
      });
      test("GET /api/categories should return an object containing an array of category objects", () => {
        return request(app)
          .get("/api/categories")
          .expect(200)
          .then((res) => {
            res.body.categories.forEach((obj) => {
              expect(obj).toMatchObject({
                description: expect.any(String),
                slug: expect.any(String),
              });
            });
          });
      });
    });
  });
  describe("/api/reviews", () => {
    describe("GET requests", () => {
      test("Should return a status code of 200", () => {
        return request(app).get("/api/reviews").expect(200);
      });
      test("Should return an object containing an array of reviews", () => {
        return request(app)
          .get("/api/reviews")
          .expect(200)
          .then((res) => {
            expect(res.body.reviews.length).not.toBe(0);
            res.body.reviews.forEach((obj) => {
              expect(obj).toMatchObject({
                review_id: expect.any(Number),
                title: expect.any(String),
                category: expect.any(String),
                designer: expect.any(String),
                owner: expect.any(String),
                review_body: expect.any(String),
                review_img_url: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              });
            });
          });
      });
      test("Should return an array of objects containing a comment_count property", () => {
        return request(app)
          .get("/api/reviews")
          .expect(200)
          .then((res) => {
            res.body.reviews.forEach((obj) => {
              expect(obj).toEqual(
                expect.objectContaining({
                  comment_count: expect.any(String),
                })
              );
            });
          });
      });
      test("Should return an array of objects sorted by date descending", () => {
        return request(app)
          .get("/api/reviews")
          .expect(200)
          .then((res) => {
            expect(res.body.reviews).toBeSortedBy("created_at", {
              descending: true,
            });
          });
      });

      test("GET /api/reviews/:review_id should return a status code of 200", () => {
        return request(app).get("/api/reviews/1").expect(200);
      });
      test("GET /api/reviews/:review_id should return an object with the review_id of 1", () => {
        return request(app)
          .get("/api/reviews/1")
          .expect(200)
          .then((res) => {
            expect(res.body.review[0]).toMatchObject({
              category: expect.any(String),
              created_at: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              review_body: expect.any(String),
              review_id: 1,
              review_img_url: expect.any(String),
              title: expect.any(String),
              votes: expect.any(Number),
            });
          });
      });
      test("GET /api/reviews/:review_id should return an object with the review_id of 5", () => {
        return request(app)
          .get("/api/reviews/5")
          .expect(200)
          .then((res) => {
            expect(res.body.review[0]).toMatchObject({
              category: expect.any(String),
              created_at: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              review_body: expect.any(String),
              review_id: 5,
              review_img_url: expect.any(String),
              title: expect.any(String),
              votes: expect.any(Number),
            });
          });
      });
      test("GET /api/reviews/:review_id should return a status code of 400 if passed an invalid type", () => {
        return request(app).get("/api/reviews/test").expect(400);
      });
      test("GET /api/reviews/:review_id should return an error message of Invalid type for request when passed an invalid type", () => {
        return request(app)
          .get("/api/reviews/test")
          .expect(400)
          .then((res) => {
            expect(res.text).toBe("Invalid type for request");
          });
      });
      test("GET /api/reviews/:review_id should return a status code of 404 if the review does not exist", () => {
        return request(app).get("/api/reviews/50").expect(404);
      });
      test("GET /api/reviews/:review_id should return the appropriate error message when passed a non-existant review id", () => {
        return request(app)
          .get("/api/reviews/999")
          .expect(404)
          .then((res) => {
            expect(res.text).toBe("No review found for review_id 999");
          });
      });
    });
    describe("POST requests", () => {
      test("Should return a status code of 201", () => {
        const requestToSend = {
          username: "mallionaire",
          body: "demonstration comment",
        };
        return request(app)
          .post("/api/reviews/5/comments")
          .send(requestToSend)
          .expect(201);
      });
      test("Should return the created post", () => {
        const requestToSend = {
          username: "mallionaire",
          body: "demonstration comment",
        };
        return request(app)
          .post("/api/reviews/5/comments")
          .send(requestToSend)
          .expect(201)
          .then((res) => {
            expect(res.body.comment).toMatchObject({
              author: "mallionaire",
              body: "demonstration comment",
              comment_id: expect.any(Number),
              created_at: expect.any(String),
              review_id: 5,
              votes: expect.any(Number),
            });
          });
      });
      test("Should return a 404 if the review_id is not found", () => {
        const requestToSend = {
          username: "mallionaire",
          body: "demonstration comment",
        };
        return request(app)
          .post("/api/reviews/999/comments")
          .send(requestToSend)
          .expect(404)
          .then((res) => {
            expect(res.text).toBe("ID not found");
          });
      });
      test("Should return a 400 if the request is not formatted correctly", () => {
        const requestToSend = {
          test: "name",
        };
        return request(app)
          .post("/api/reviews/5/comments")
          .send(requestToSend)
          .expect(400)
          .then((res) => {
            expect(res.text).toBe("Invalid type for request");
          });
      });
      test("Should return a 400 if the request contains no body", () => {
        const requestToSend = {};
        return request(app)
          .post("/api/reviews/5/comments")
          .send(requestToSend)
          .expect(400)
          .then((res) => {
            expect(res.text).toBe("Invalid type for request");
          });
      });
      test("Should return a 400 if the review_id is of an invalid type", () => {
        const requestToSend = {
          username: "mallionaire",
          body: "demonstration comment",
        };
        return request(app)
          .post("/api/reviews/test/comments")
          .send(requestToSend)
          .expect(400)
          .then((res) => {
            expect(res.text).toBe("Invalid type for request");
          });
      });
      test("Should return a 201 when posting a comment with extra properties (which should be ignored)", () => {
        const requestToSend = {
          username: "mallionaire",
          body: "demonstration comment",
          votes: 5,
        };
        return request(app)
          .post("/api/reviews/5/comments")
          .send(requestToSend)
          .expect(201)
          .then((res) => {
            expect(res.body.comment).toMatchObject({
              author: "mallionaire",
              body: "demonstration comment",
              comment_id: expect.any(Number),
              created_at: expect.any(String),
              review_id: 5,
              votes: 0,
            });
          });
      });
    });
  });
});
