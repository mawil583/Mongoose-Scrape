// NPM dependencies
let express = require("express");
let mongoose = require("mongoose");
let cheerio = require("cheerio");
let axios = require("axios");
let exphbs = require("express-handlebars");

// File dependencies
let db = require("./models");

// Defining port number
let PORT = process.env.PORT || 3000;

// initializing express
let app = express();

// initialize handlebars
app.engine('handlebars', exphbs({ defaultLayout: "main" }));
app.set('view engine', 'handlebars');

// parse request body as json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// make public a static folder
app.use(express.static("public"));

// Connecting to MongoDB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);


// A GET route for scraping the APnews website
app.get("/", function (req, res) {
    // First, we grab the body of the html with axios
    console.log("in root path before axios call");

    axios
        .get("https://apnews.com/apf-topnews/")
        .then(function (response) {
            console.log("this is within axios call")
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);

            // Now, we grab every div tag that has a class of FeedCard within an article tag, and do the following:
            $("article div.FeedCard").each(async function (i, element) {
                // Save an empty result object

                // Add the text and href of every link, and save them as properties of the result object
                // let title = $(this)
                //     .children("h1")
                //     .text();
                let summary = $(this)
                    .text();
                let title = $(this)
                    .children("a")
                    .text()
                let link = "https://apnews.com/apf-topnews" + $(this)
                    .children("a")
                    .attr("href");
                // console.log("title: ",title);
                // results.push({
                //     summary: summary,
                //     link: link
                // })
                let results = {
                    summary: summary,
                    title: title,
                    link: link
                }
                console.log("results before db call in server.js", results)
                let duplicates = await db.Article.find({ title: results.title })
                if (duplicates.length > 0) {
                    console.log("this entry already exists");
                    console.log("duplicates: ", duplicates);
                } else {
                    // insert db.Article.create from below
                    let dbArticle = await db.Article.create(results);
                    // View the added result in the console
                    console.log("line 66 server.js", dbArticle);
                    // If an error occurred, log it
                }

                // Create a new Article using the `result` object built from scraping
            });
            console.log("this comes just before res.render")
            console.log("this comes after res.render");
            // Send a message to the client
            // res.send("Scrape Complete");
            db.Article.find({})
                .populate('note')
                .then(function (dbArticles) {
                    console.log(dbArticles);
                    let articles = {
                        data: dbArticles.slice(0, 25)
                    }
                    // console.log(articles);
                    res.render("index", articles);
                })
        });
});

app.post("/api/note/:id", function (req, res) {
    console.log(req.body);
    db.Note
        .create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id },
                { $push: { note: dbNote._id }},
                { new: true }
            );
        })
        .then(function (dbArticle) {
            console.log("updated Article collection");

            // let notesData = {
            //     notes: dbArticle
            // }
            
            res.render("index", notesData);
        })
        .catch(function(err) {
            res.json(err)
        });
});

app.listen(PORT, function () {
    console.log("App is listening on port " + PORT);
})



