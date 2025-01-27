const jsonwebtoken = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Not authorize" });
    }

    const checkToken = jsonwebtoken.verify(
      token,
      process.env.JSONWEBTOKEN_SECRET_KEY
    );

    req.user = checkToken;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Your session has expired. Please log in again." });
  }
};
