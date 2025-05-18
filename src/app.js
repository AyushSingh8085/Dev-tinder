const express = require("express");
const app = express();
const PORT = 7777;

app.get("/user/:userId", (req, res) => {
  console.log(req.params);
});

app.get("/user", (req, res) => {
  // /user?userId=1&name=ayush
  console.log(req.query);
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
