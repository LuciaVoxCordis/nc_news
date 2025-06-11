const handlePostgresErrors = (err, req, res, next) => {
  if ((err.code = "22P02")) {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
};

const handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

const handleOtherErrors = (err, req, res, next) => {
  res.status(500).send("Something isn't working...");
};

module.exports = {
  handlePostgresErrors,
  handleCustomErrors,
  handleOtherErrors,
};
