const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://namastenodedev:Ayush-8085@namaste-node.g6q8sos.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
