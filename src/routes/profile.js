const express = require("express");
const { userAuth } = require("../middlewares/auth");
const {
  validateEditProfileData,
  validateEditPasswordData,
} = require("../utils/validation");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined) {
        loggedInUser[key] = req.body[key];
      }
    });

    await loggedInUser.save();

    res.status(200).json({
      message: "Profile updated successfully!",
      user: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    if (!validateEditPasswordData(req)) {
      throw new Error("Invalid edit request");
    }

    const loggedInUser = req.user;
    const { existingPassword, password } = req.body;

    const isExistingPasswordCorrect = await loggedInUser.validatePassword(
      existingPassword
    );

    if (!isExistingPasswordCorrect) {
      throw new Error("Existing password is incorrect");
    }

    const newPasswordHash = await bcrypt.hash(password, 10);

    loggedInUser.password = newPasswordHash;

    await loggedInUser.save();

    res.send("Password updated successfully!");
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = profileRouter;
