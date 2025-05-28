const express = require("express");

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", async (req, res) => {
  res.send("Sending connection request");
});

module.exports = requestRouter;
