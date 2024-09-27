"use strict";

const mongoose = require("mongoose");
const {
  db: { host, name, username, password },
} = require("../configs/config.mongodb");

const connectString = `mongodb+srv://${username}:${password}@${host}/${name}`;

console.log(`connectString:`, connectString);

class Database {
  constructor() {
    this.connect();
  }

  //connect
  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectString, {
        maxPoolSize: 50,
      })
      .then((_) => console.log(`Connected Mongodb Success`))
      .catch((err) => console.log(`MongoDB Connect Error:`, err));
  }
  // dev
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
