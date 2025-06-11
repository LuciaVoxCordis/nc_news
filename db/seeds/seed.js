const db = require("../connection");
const format = require("pg-format");
const {
  convertTimestampToDate,
  createRefObj,
  convertToID,
} = require("./utils");

const seed = async ({ topicData, userData, articleData, commentData }) => {
  await db.query("DROP TABLE IF EXISTS comments");
  await db.query("DROP TABLE IF EXISTS articles");
  await db.query("DROP TABLE IF EXISTS users");
  await db.query("DROP TABLE IF EXISTS topics");

  await db.query(
    "CREATE TABLE topics (slug VARCHAR(100) PRIMARY KEY, description VARCHAR(100), img_url VARCHAR(1000))"
  );
  await db.query(
    "CREATE TABLE users (username VARCHAR(40) PRIMARY KEY, name VARCHAR(40), avatar_url VARCHAR(1000))"
  );
  await db.query(
    "CREATE TABLE articles (article_id SERIAL PRIMARY KEY, title VARCHAR(100), topic VARCHAR(100) REFERENCES topics(slug) ON DELETE CASCADE NOT NULL, author VARCHAR(100) REFERENCES users(username) ON DELETE CASCADE NOT NULL, body TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, votes INT DEFAULT 0, article_img_url VARCHAR(1000))"
  );
  await db.query(
    "CREATE TABLE comments (comment_id SERIAL PRIMARY KEY, article_id INT REFERENCES articles(article_id) ON DELETE CASCADE NOT NULL, body TEXT, votes INT DEFAULT 0, author VARCHAR(40) REFERENCES users(username) ON DELETE CASCADE NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
  );

  const formattedTopicData = topicData.map((topic) => {
    return Object.values(topic);
  });
  await db.query(
    format(
      "INSERT INTO topics (description, slug, img_url) VALUES %L",
      formattedTopicData
    )
  );

  const formattedUserData = userData.map((user) => {
    return Object.values(user);
  });
  await db.query(
    format(
      "INSERT INTO users (username, name, avatar_url) VALUES %L",
      formattedUserData
    )
  );

  const formattedArticleData = articleData.map((article) => {
    const withConvertedTimestamp = convertTimestampToDate(article);
    return Object.values(withConvertedTimestamp);
  });
  await db.query(
    format(
      "INSERT INTO articles (created_at, title, topic, author, body, votes, article_img_url) VALUES %L",
      formattedArticleData
    )
  );

  const commentDataUpdatedID = convertToID(
    await createRefObj("articles", "title", "article_id"),
    commentData,
    "article_title"
  );
  const formattedCommentsData = await commentDataUpdatedID.map((comment) => {
    const withConvertedTimestamp = convertTimestampToDate(comment);
    return Object.values(withConvertedTimestamp);
  });
  await db.query(
    format(
      "INSERT INTO comments (created_at, article_id, body, votes, author) VALUES %L",
      formattedCommentsData
    )
  );
};

module.exports = seed;
