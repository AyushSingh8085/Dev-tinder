const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      // throw res.status(401).send("Please login!");
      throw new Error();
    }

    const decodedObj = await jwt.verify(token, "DevTinder@123");

    const { _id } = decodedObj;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ error: "TokenExpiredError", message: "JWT token has expired" });
    } else {
      return res
        .status(401)
        .json({ error: "InvalidToken", message: "JWT token is invalid" });
    }
  }
};

module.exports = { userAuth };
