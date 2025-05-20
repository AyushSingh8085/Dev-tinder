const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const PORT = 7777;
// const { adminAuth } = require("./middlewares/auth");

app.get("/getUserData", (req, res) => {
  throw new Error("ewfwefe");
  res.send("User data sent");
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong");
  }
});

// app.use("/admin", adminAuth);

app.post("/signup", async (req, res) => {
  try {
    const userObj = {
      firstName: "Tom",
      lastName: "Cruise",
      password: "tom@123",
      emailId: "tom@gmail.com",
      // age: 22,
    };

    // Creating a new instance of the user model
    const user = new User(userObj);

    await user.save();

    res.status(201).send("User added successfully!");
  } catch (error) {
    res.status(400).send("Error saving the user: ", err.message);
  }
});

// app.get("/admin/deleteData", adminAuth, (req, res, next) => {
//   res.send("Route Handler 2");
// });

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected", err.message);
  });
