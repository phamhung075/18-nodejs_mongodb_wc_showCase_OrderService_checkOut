"use strict";

require("dotenv").config();
const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const app = express();

//console.log(`Process::`, process.env);

// init middlewares
app.use(morgan("dev"));
// app.use(morgan("dev"))  //  dev
// app.use(morgan("combined")) // production
// app.use(morgan("common"))
// app.use(morgan("short"))
// app.use(morgan("tiny"))

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// init db
require("./dbs/init.mongodb.js");

// //check connect
// const { countConnect } = require("./helpers/check.connect.js");
// countConnect();

// //check overload
// const { checkOverload } = require("./helpers/check.connect.js");
// checkOverload();

// init router
app.use("/", require("./routes"));

// handling error

app.use ((req, res, next) => { //function middleware có 3 tham số
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})


app.use ((error, req, res, next) => { // function quản lý lỗi có 4 tham số
  const statusCode = error.status || 500 //500 là lỗi mặc định server
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    stack: error.stack,
    message: error.message || 'Internal Server Error'
  })
})


module.exports = app;
