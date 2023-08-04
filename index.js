const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

// Set the view engine to ejs
app.set("view engine", "ejs");

// Use body-parser to parse the request body
app.use(bodyParser.urlencoded({ extended: true }));

// Use express.static to serve static files from the public directory
app.use(express.static("public"));

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/WIKIDB");

// Create a schema for articles
const articleSchema = {
    title: String,
    content: String,
};

// Create a model for articles
const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
    .get(async (req, res) => {
        const foundArticles = await Article.find();
        res.send(foundArticles);
    })

    .post(async (req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content,
        });
        newArticle.save();
        res.status(201).send({ message: "Article created" });
    })

    .delete(async (req, res) => {
        try {
            await Article.deleteMany();
            res.send("Successfully deleted");
        } catch (error) {
            res.send(error);
        }
    });

// Routes for updating and deleting articles
app.route("/articles/:articleTitle")
    .get(async (req, res) => {
        const articleTitle = req.params.articleTitle;
        const foundArticle = await Article.findOne({ title: articleTitle });
        res.send(foundArticle);
    })
    .put(async (req, res) => {
        const articleTitle = req.params.articleTitle;
        const article = await Article.findOne({ title: articleTitle });
        if (!article) {
            return res.status(400).send("Article not found");
        }
        article.title = req.body.title;
        article.content = req.body.content;
        article.save();
        res.send("Article updated");
    })
    .delete(async (req, res) => {
        const articleTitle = req.params.articleTitle;
        try {
            await Article.deleteOne({ title: articleTitle });
            res.send("Successfully deleted");
        } catch (error) {
            res.send(error);
        }
    });

// Start the server
app.listen(3000, () => {
    console.log("Server started");
});
