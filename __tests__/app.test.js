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
      test("Should return reviews by selected category (social deduction) if specfied", () => {
        return request(app)
          .get("/api/reviews?category=social_deduction")
          .expect(200)
          .then((res) => {
            res.body.reviews.forEach((obj) => {
              expect(obj).toHaveProperty("category", "social deduction");
            });
          });
      });
      test("Should return reviews by selected category (dexterity) if specfied", () => {
        return request(app)
          .get("/api/reviews?category=dexterity")
          .expect(200)
          .then((res) => {
            res.body.reviews.forEach((obj) => {
              expect(obj).toHaveProperty("category", "dexterity");
            });
          });
      });
      test("Should return a 404 if category specified does not exist", () => {
        return request(app).get("/api/reviews?category=test").expect(404);
      });
      test("Should return an empty array if the category exists but no reviews are found", () => {
        return request(app)
          .get("/api/reviews?category=childrens_games")
          .expect(200)
          .then((res) => {
            expect(res.body.reviews).toEqual([]);
          });
      });
      test("Should return an array sorted by specified column (owner)", () => {
        return request(app)
          .get("/api/reviews?sort_by=owner")
          .expect(200)
          .then((res) => {
            expect(res.body.reviews).toBeSortedBy("owner", {
              descending: true,
            });
          });
      });
      test("Should return an array sorted by specified column (votes)", () => {
        return request(app)
          .get("/api/reviews?sort_by=votes")
          .expect(200)
          .then((res) => {
            expect(res.body.reviews).toBeSortedBy("votes", {
              descending: true,
            });
          });
      });
      test("Should return an array ordered by ascending (created_at)", () => {
        return request(app)
          .get("/api/reviews?order=asc")
          .expect(200)
          .then((res) => {
            expect(res.body.reviews).toBeSortedBy("created_at", {
              descending: false,
            });
          });
      });
      test("Should return an array with multiple queries", () => {
        return request(app)
          .get("/api/reviews?category=social_deduction&sort_by=votes&order=asc")
          .expect(200)
          .then((res) => {
            expect(res.body.reviews).toBeSortedBy("votes", {
              descending: false,
            });
            res.body.reviews.forEach((obj) => {
              expect(obj).toHaveProperty("category", "social deduction");
            });
          });
      });
      test("Should return a 400 if query values are of an invalid type (order)", () => {
        return request(app)
          .get("/api/reviews?category=social_deduction&sort_by=votes&order=ooo")
          .expect(400);
      });
      test("Should return a 400 if query keys are of an invalid type (sort_by)", () => {
        return request(app)
          .get("/api/reviews?category=social_deduction&sort_by=test&order=desc")
          .expect(400);
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
      test("GET /api/reviews/2/comments should return a status code of 200", () => {
        return request(app).get("/api/reviews/2/comments").expect(200);
      });
      test("GET /api/reviews/2/comments should return an array of comments", () => {
        return request(app)
          .get("/api/reviews/2/comments")
          .expect(200)
          .then((res) => {
            expect(res.body.comments.length).toBe(3);
          });
      });
      test("GET /api/reviews/2/comments should return an array of objects with the expected properties", () => {
        return request(app)
          .get("/api/reviews/2/comments")
          .expect(200)
          .then((res) => {
            res.body.comments.forEach((obj) => {
              expect(obj).toMatchObject({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                review_id: 2,
              });
            });
          });
      });
      test("GET /api/reviews/2/comments should return with an array of objects ordered with the most recent comments first", () => {
        return request(app)
          .get("/api/reviews/2/comments")
          .expect(200)
          .then((res) => {
            expect(res.body.comments).toBeSortedBy("created_at", {
              descending: true,
            });
          });
      });
      test("GET /api/reviews/test/comments should return a status code of 400", () => {
        return request(app).get("/api/reviews/test/comments").expect(400);
      });
      test("GET /api/reviews/test/comments should return a status code of 400 with the appropriate message", () => {
        return request(app)
          .get("/api/reviews/test/comments")
          .expect(400)
          .then((res) => {
            expect(res.text).toBe("Invalid type for request");
          });
      });
      test("GET /api/reviews/8/comments should return a status code of 200", () => {
        return request(app)
          .get("/api/reviews/8/comments")
          .expect(200)
          .then((res) => {
            expect(res.body).toEqual({ comments: [] });
          });
      });
      test("GET /api/reviews/999/comments should return a status code of 404", () => {
        return request(app).get("/api/reviews/999/comments").expect(404);
      });
      test("GET /api/reviews/999/comments should return the appropriate error message", () => {
        return request(app)
          .get("/api/reviews/999/comments")
          .expect(404)
          .then((res) => {
            expect(res.text).toBe("No review found for review_id 999");
          });
      });
    });
    describe("PATCH requests", () => {
      test("Should return a status code of 201 if the update is sucessfull", () => {
        const reqBody = {
          inc_votes: 10,
        };
        return request(app).patch("/api/reviews/1").send(reqBody).expect(201);
      });
      test("Should return the review with the updated vote increment", () => {
        const reqBody = {
          inc_votes: 1,
        };
        return request(app)
          .patch("/api/reviews/4")
          .send(reqBody)
          .expect(201)
          .then((res) => {
            expect(res.body.review).toHaveLength(1);
            expect(res.body.review[0]).toMatchObject({
              title: "Dolor reprehenderit",
              designer: "Gamey McGameface",
              owner: "mallionaire",
              review_img_url: expect.any(String),
              review_body: expect.any(String),
              category: "social deduction",
              created_at: expect.any(String),
              votes: 8,
            });
          });
      });
      test("Should return the review with the updated vote increment when the increment is 100", () => {
        const reqBody = {
          inc_votes: 100,
        };
        return request(app)
          .patch("/api/reviews/4")
          .send(reqBody)
          .expect(201)
          .then((res) => {
            expect(res.body.review).toHaveLength(1);
            expect(res.body.review[0]).toMatchObject({
              title: "Dolor reprehenderit",
              designer: "Gamey McGameface",
              owner: "mallionaire",
              review_img_url: expect.any(String),
              review_body: expect.any(String),
              category: "social deduction",
              created_at: expect.any(String),
              votes: 107,
            });
          });
      });
      test("Should return a 404 if the requested review is not found", () => {
        const reqBody = {
          inc_votes: 100,
        };
        return request(app).patch("/api/reviews/999").send(reqBody).expect(404);
      });
      test("Should return a 200 if the request body is in the incorrect format", () => {
        const reqBody = {
          upvotes: 100,
        };
        return request(app).patch("/api/reviews/2").send(reqBody).expect(400);
      });
      test("Should return a 400 if the request contains no body", () => {
        const reqBody = {};
        return request(app).patch("/api/reviews/2").send(reqBody).expect(400);
      });
      test("Should decrement the vote if inc_votes has a negative value", () => {
        const reqBody = {
          inc_votes: -20,
        };
        return request(app)
          .patch("/api/reviews/4")
          .send(reqBody)
          .expect(201)
          .then((res) => {
            expect(res.body.review).toHaveLength(1);
            expect(res.body.review[0]).toMatchObject({
              title: "Dolor reprehenderit",
              designer: "Gamey McGameface",
              owner: "mallionaire",
              review_img_url: expect.any(String),
              review_body: expect.any(String),
              category: "social deduction",
              created_at: expect.any(String),
              votes: -13,
            });
          });
      });
      test("Should return a 400 if the review_id is of an invalid type", () => {
        const reqBody = {
          inc_votes: 10,
        };
        return request(app)
          .patch("/api/reviews/test")
          .send(reqBody)
          .expect(400);
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
  describe("/api/users", () => {
    describe("GET reqeusts", () => {
      test("GET /api/users should respond with a status code of 200", () => {
        return request(app).get("/api/users").expect(200);
      });
      test("GET /api/users should return an array of user objects", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then((res) => {
            expect(res.body.users.length).not.toBe(0);
            expect(typeof res.body.users).toBe("object");
            res.body.users.forEach((obj) => {
              expect(obj).toMatchObject({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              });
            });
          });
      });
    });
  });
});
