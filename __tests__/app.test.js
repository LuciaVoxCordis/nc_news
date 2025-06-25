const endpointsJson = require("../endpoints.json");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const request = require("supertest");
const requestExists = require("../models/models-utils");

beforeEach(() => seed(data));
afterAll(() => db.end());

//describe("/api", () => {
//  test("GET 200: Responds with an object detailing the documentation for each endpoint", async () => {
//    const { body } = await request(app).get("/api").expect(200);
//    const endpoints = body.endpoints;
//    expect(endpoints).toEqual(endpointsJson);
//  });
//});

//~~~~~~~~~~~~~~~~~~~~TOPICS TESTS~~~~~~~~~~~~~~~~~~~~

describe("/api/topics", () => {
  test("Get 200: Responds with an object with a key of 'topics' with value of an array containing an object representing each topic held within the topics table", async () => {
    const { body } = await request(app).get("/api/topics").expect(200);
    const topics = body.topics;
    topics.forEach((topic) => {
      expect(topics.length).not.toBe(0);
      expect(Object.keys(topic).length).toBe(3);
      expect(typeof topic.slug).toBe("string");
      expect(typeof topic.description).toBe("string");
      expect(typeof topic.img_url).toBe("string");
    });
  });
});

//~~~~~~~~~~~~~~~~~~~~ARTICLES TESTS~~~~~~~~~~~~~~~~~~~~

describe("/api/articles", () => {
  test("GET 200: Responds with an object with a key of 'articles' with value of an array containing objects representing each article held within the articles table. objects should be in descending date order by default", async () => {
    const { body } = await request(app).get("/api/articles").expect(200);
    const articles = body.articles;
    expect(articles.length).not.toBe(0);
    expect(articles[0].article_id).toBe(3);
    expect(articles[12].article_id).toBe(7);
    articles.forEach((article) => {
      expect(Object.keys(article).length).toBe(8);
      expect(typeof article.article_id).toBe("number");
      expect(typeof article.title).toBe("string");
      expect(typeof article.topic).toBe("string");
      expect(typeof article.author).toBe("string");
      expect(typeof article.created_at).toBe("string");
      expect(typeof article.votes).toBe("number");
      expect(typeof article.article_img_url).toBe("string");
      expect(typeof article.comment_count).toBe("number");
    });
  });
  test("GET 200: Array within the response object can be sorted by a specified key when that key is added to the url as a query", async () => {
    const { body } = await request(app)
      .get("/api/articles?query=sort_by=article_id")
      .expect(200);
    const articles = body.articles;
    expect(articles[0].article_id).toBe(13);
    expect(articles[12].article_id).toBe(1);
    expect(articles.length).not.toBe(0);
    articles.forEach((article) => {
      expect(Object.keys(article).length).toBe(8);
      expect(typeof article.article_id).toBe("number");
      expect(typeof article.title).toBe("string");
      expect(typeof article.topic).toBe("string");
      expect(typeof article.author).toBe("string");
      expect(typeof article.created_at).toBe("string");
      expect(typeof article.votes).toBe("number");
      expect(typeof article.article_img_url).toBe("string");
      expect(typeof article.comment_count).toBe("number");
    });
  });
  test("GET 200: Array within the response object can be sorted in ascending or desending order when specified in the url query", async () => {
    const { body } = await request(app)
      .get("/api/articles?query=sortby=article_id+order=ASC")
      .expect(200);
    const articles = body.articles;
    expect(articles[0].article_id).toBe(1);
    expect(articles[12].article_id).toBe(13);
    expect(articles.length).not.toBe(0);
    articles.forEach((article) => {
      expect(Object.keys(article).length).toBe(8);
      expect(typeof article.article_id).toBe("number");
      expect(typeof article.title).toBe("string");
      expect(typeof article.topic).toBe("string");
      expect(typeof article.author).toBe("string");
      expect(typeof article.created_at).toBe("string");
      expect(typeof article.votes).toBe("number");
      expect(typeof article.article_img_url).toBe("string");
      expect(typeof article.comment_count).toBe("number");
    });
  });
});

describe("/api/articles/topics/:topic", () => {
  test("GET 200 Responds with an array of articles where the topic matches the specified topic within the url", async () => {
    const { body } = await request(app)
      .get("/api/articles/topics/mitch")
      .expect(200);
    const articles = body.articles;
    console.log(articles);
    expect(articles.length).toBe(12);
    articles.forEach((article) => {
      expect(article.topic).toBe("mitch");
    });
  });
});

describe("/api/article/:article_id", () => {
  test("GET 200: Responds with an object of a single specified article held within the articles table when queried with that articles user_id", async () => {
    const { body } = await request(app).get("/api/articles/3").expect(200);
    const article = body;
    expect(article.article_id).toBe(3);
    expect(typeof article.title).toBe("string");
    expect(typeof article.topic).toBe("string");
    expect(typeof article.author).toBe("string");
    expect(typeof article.body).toBe("string");
    expect(typeof article.created_at).toBe("string");
    expect(typeof article.votes).toBe("number");
    expect(typeof article.article_img_url).toBe("string");
  });
  test("GET 400: Responds with an object containing key of 'msg' with a value of 'bad request' when user_id is not a number", async () => {
    const { body } = await request(app).get("/api/articles/fish").expect(400);
    const error = body;
    expect(error.msg).toBe("bad request");
  });
  test("GET 404: Responds with an object containing a key of 'msg' with a value of 'not found' when user_id is a valid endpoint, but cannot be found within the database", async () => {
    const { body } = await request(app).get("/api/articles/99999").expect(404);
    const error = body;
    expect(error.msg).toBe("not found");
  });
  test("PATCH 202: Responds with an object representing a newly updated article to the database, with article_id matching the one specified and votes increased by the specified amount", async () => {
    const { body } = await request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: 50 })
      .expect(202);
    const article = body;
    expect(article.article_id).toBe(3);
    expect(article.votes).toBe(50);
  });
  test("PATCH 202: Responds with an object representing a newly updated article to the database, with article_id matching the one specified and votes decreased by the specified amount", async () => {
    const { body } = await request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -25 })
      .expect(202);
    const article = body;
    expect(article.article_id).toBe(1);
    expect(article.votes).toBe(75);
  });
  test("PATCH 400: responds with an object containing a key of 'msg' with a value of 'bad request' when user_id is not a number", async () => {
    const { body } = await request(app)
      .patch("/api/articles/banana")
      .send({ inc_votes: 20 })
      .expect(400);
    const error = body;
    expect(error.msg).toBe("bad request");
  });
  test("PATCH 404: responds with an object containing a key of 'msg' with a value of 'bad request' when user_id is of valid type, but not found within the database", async () => {
    const { body } = await request(app)
      .patch("/api/articles/999999")
      .send({ inc_votes: 20 })
      .expect(404);
    const error = body;
    expect(error.msg).toBe("not found");
  });
  test("PATCH 400: Responds with an object containing a key of 'msg' witha  value of 'bad request' when inc_votes is not a valid number", async () => {
    const { body } = await request(app)
      .patch("/api/articles/2")
      .send({ inc_votes: "fish" })
      .expect(400);
    const error = body;
    expect(error.msg).toBe("bad request");
  });
});

describe("/api/articles/:user_id/comments", () => {
  test("GET 200: Responds with an Object with a key of 'comments' and value of an array of objects representing each comment ascociated with a specified article", async () => {
    const { body } = await request(app)
      .get("/api/articles/1/comments")
      .expect(200);
    const comments = body.comments;
    expect(comments.length).not.toBe(0);
    comments.forEach((comment) => {
      expect(typeof comment.comment_id).toBe("number");
      expect(comment.article_id).toBe(1);
      expect(typeof comment.body).toBe("string");
      expect(typeof comment.votes).toBe("number");
      expect(typeof comment.author).toBe("string");
      expect(typeof comment.created_at).toBe("string");
    });
  });
  test("GET 404: Responds with an object containing a key of 'msg' with a value of 'not found' when user_id is a valid endpoint, but cannot be found within the database", async () => {
    const { body } = await request(app)
      .get("/api/articles/99999/comments")
      .expect(404);
    const error = body;
    expect(error.msg).toBe("not found");
  });
  test("POST 201: Responds with an object representing a newly added comment to the database, with article_id matching the one specified", async () => {
    const { body } = await request(app)
      .post("/api/articles/3/comments")
      .send({
        body: "Test comment",
        author: "lurker",
      })
      .expect(201);
    const comment = body;
    expect(comment.article_id).toBe(3);
    expect(typeof comment.comment_id).toBe("number");
    expect(typeof comment.body).toBe("string");
    expect(typeof comment.votes).toBe("number");
    expect(typeof comment.author).toBe("string");
    expect(typeof comment.created_at).toBe("string");
  });
  test("POST 400: responds with an object containing a key of 'msg' with a value of 'bad request' when user_id is not a number", async () => {
    const { body } = await request(app)
      .post("/api/articles/ferret/comments")
      .send({ body: "test comment", author: "lurker" })
      .expect(400);
    const error = body;
    expect(error.msg).toBe("bad request");
  });
  test("POST 400: responds with an object containing a key of 'msg' with a value of 'bad request' when user_id is vallid, but being sent the wrong data type", async () => {
    const { body } = await request(app)
      .post("/api/articles/ferret/comments")
      .send({ body: "test comment", author: 4 })
      .expect(400);
    const error = body;
    expect(error.msg).toBe("bad request");
  });
  test("POST 400: responds with an object containing a key of 'msg' with a value of 'bad request' when user_id is valid type, but does not exist within the database", async () => {
    const { body } = await request(app)
      .post("/api/articles/99999/comments")
      .send({ body: "test comment", author: "lurker" })
      .expect(400);
    const error = body;
    expect(error.msg).toBe("bad request");
  });
});

//~~~~~~~~~~~~~~~~~~~~USERS TESTS~~~~~~~~~~~~~~~~~~~~

describe("/api/users", () => {
  test("GET 200: Responds with an object with a key of 'uers' with value of an array countaining objects representing each user held within the users table", async () => {
    const { body } = await request(app).get("/api/users").expect(200);
    const users = body.users;
    expect(users.length).not.toBe(0);
    users.forEach((user) => {
      expect(typeof user.username).toBe("string");
      expect(typeof user.name).toBe("string");
      expect(typeof user.avatar_url).toBe("string");
    });
  });
});

//~~~~~~~~~~~~~~~~~~~~COMMENTS TESTS~~~~~~~~~~~~~~~~~~~~

describe("/api/comments/:comments_id", () => {
  test("DELETE 204: Responds with nothing and deletes the specified entry from the comments table", async () => {
    await request(app).delete("/api/comments/3").expect(204);
    const exists = await requestExists("comments", "comment_id", 3);
    expect(exists).toBe(false);
  });
  test("DELETE 400: Responds with an object containing a key of 'msg' witha  value of 'bad request' when specified comment_id is not a valid number", async () => {
    const { body } = await request(app)
      .delete("/api/comments/fish")
      .expect(400);
    const error = body;
    expect(error.msg).toBe("bad request");
  });
  test("DELETE 400: Responds with an object containing a key of 'msg' with a  value of 'bad request' when specified comment_id is a valid number, but is not found within the database", async () => {
    const { body } = await request(app)
      .delete("/api/comments/9999")
      .expect(400);
    const error = body;
    expect(error.msg).toBe("bad request");
  });
});
