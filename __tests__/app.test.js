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
    });
  });
});
