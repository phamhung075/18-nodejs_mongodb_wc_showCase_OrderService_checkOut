"use strict";

const mongoose = require("mongoose");

// const PORT = 27017;

const connectString = `mongodb://localhost:27017/shopDEV`;

mongoose
  .connect(connectString)
  .then((_) => console.log(`Connected Mongodb Success at port 27017`))
  .catch((err) => console.log(`MongoDB Connect Error:`, err));

// dev
if (1 === 0) {
  mongoose.set("debug", true);
  mongoose.set("debug", { color: true });
}

module.exports = mongoose;
