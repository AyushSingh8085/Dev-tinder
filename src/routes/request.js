const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatuses = ["ignored", "interested"];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: `Invalid status type: ` + status,
        });
      }

      // OR use Pre method

      // if (fromUserId === toUserId) {
      //   return res.status(400).json({
      //     message: "You cannot send a connection request to yourself",
      //   });
      // }

      const userExists = await User.findById(toUserId);
      if (!userExists) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).json({
          message: "Connection request already exists",
        });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      const emailRes = await sendEmail.run(
        "A new friend request from" + " " + req.user?.firstName,
        req.user?.firstName + " " + status + " in " + userExists.firstName
      );

      console.log(emailRes);

      res.status(201).json({
        message: req.user?.firstName + status + "in" + userExists.firstName,
        data,
      });
    } catch (error) {
      res.status(400).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const requestId = req.params.requestId;
      const status = req.params.status;

      const allowedStatuses = ["accepted", "rejected"];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: `Invalid review status type: ` + status,
        });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(404).json({
          message: "Connection request not found",
        });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.status(200).json({
        message: `Connection request ${status} successfully`,
        data,
      });
    } catch (error) {
      res.status(400).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }
);

module.exports = requestRouter;
