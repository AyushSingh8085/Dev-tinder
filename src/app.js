const express = require("express");
const app = express();
const PORT = 7777;

// Over-rides the any paths after this with own  (Keep the order of the code)

// app.use("/", (req, res) => {
//   res.send("Hello World");
// });

app.use("/test", (req, res) => {
  res.send("Hello World");
});

// Correct position
app.use("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
