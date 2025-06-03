const cron = require("node-cron");
const ConnectionRequestModel = require("../models/connectionRequest");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("./sendEmail");

// 8 Am in the morning
cron.schedule("0 8 * * *", async () => {
  try {
    const yesterday = subDays(new Date(), 1);

    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequestsOfYesterday = await ConnectionRequestModel.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

    const listOfEmails = [
      ...new Set(
        pendingRequestsOfYesterday.map((req) => req?.toUserId?.emailId)
      ),
    ];

    for (const email of listOfEmails) {
      try {
        const res = await sendEmail.run(
          "New friend request pending for " + email,
          " There are many friend requests pending, please login to tinderdev.online and accept or reject to request."
        );

        console.log(res);
      } catch (error) {
        console.log("ERROR: " + error.message);
      }
    }
  } catch (error) {
    console.log("ERROR: " + error.message);
  }
});

// module.exports = cron;
