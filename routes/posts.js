var express = require("express");
var router = express.Router();
var Post = require("../models/post");

// Show all posts
router.get("/", function (req, res) {
    Post.find({}, function (err, allPosts) {
        if (err) {
            console.log(err);
        } else {
            res.render("posts/index", {posts: allPosts});
        }
    });
});

// Add new post to DB
router.post("/", isLoggedIn, function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newPost = {name: name, image: image, description: desc, author: author};

    Post.create(newPost, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            console.log(newlyCreated);
            res.redirect("/posts");
        }
    });
});

router.get("/new", isLoggedIn, function (req, res) {
    res.render("posts/new");
});

// Shows more info about one post
router.get("/:id", function (req, res) {
    Post.findById(req.params.id).populate("comments").exec(function (err, foundPost) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundPost);
            res.render("posts/show", {post: foundPost});
        }
    });
});

// middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;