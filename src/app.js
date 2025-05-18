const express = require("express");
const app = express();
const PORT = 7777;

app.use("/test", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
