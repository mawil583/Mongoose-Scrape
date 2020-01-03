// NPM dependencies
let express = require("express");
let mongoose = require("mongoose");
let cheerio = require("cheerio");
let axios = require("axios");

// File dependencies
let db = require("./models");

// Defining port number
let PORT = 3000;

// initializing express
let app = express();

// parse request body as json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// make public a static folder
app.use(express.static("public"));

// Connecting to MongoDB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

app.listen(PORT, function() {
    console.log("App is listening on port " + PORT);
})



