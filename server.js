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

// A GET route for scraping the echoJS website
app.get("/", function (req, res) {
    // First, we grab the body of the html with axios
    console.log("in root path before axios call");
    axios.get("https://apnews.com/apf-topnews/").then(function (response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
      var results = [];
  
      // Now, we grab every div tag that has a class of FeedCard within an article tag, and do the following:
      $("article div.FeedCard").each(function (i, element) {
        // Save an empty result object
  
        // Add the text and href of every link, and save them as properties of the result object
        let title = $(this)
          .children("h1")
          .text();
        let link = "https://apnews.com/apf-topnews" + $(this)
          .children("a")
          .attr("href");
  
          results.push({
              title: title,
              link: link
          })
          console.log(results)
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function (dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function (err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
  
      // Send a message to the client
      res.send("Scrape Complete");
    });
  });

app.listen(PORT, function() {
    console.log("App is listening on port " + PORT);
})



