var express = require("express");
var router = express.Router();
var Post = require("../models/post");

//INDEX - show all posts
router.get("/", function (req, res) {
    // Get all posts from DB
    Post.find({}, function (err, allPosts) {
        if (err) {
            console.log(err);
        } else {
            res.render("posts/index", {posts: allPosts});
        }
    });
});

//CREATE - add new post to DB
router.post("/", isLoggedIn, function (req, res) {
    // get data from form and add to posts array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newPost = {name: name, image: image, description: desc, author: author};
    // Create a new post and save to DB
    Post.create(newPost, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            //redirect back to posts page
            console.log(newlyCreated);
            res.redirect("/posts");
        }
    });
});

//NEW - show form to create new post
router.get("/new", isLoggedIn, function (req, res) {
    res.render("posts/new");
});

//Show - shows more info about one post
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

// EDIT POST ROUTE
router.get("/:id/edit", function (req, res) {
    Post.findById(req.params.id, function (err, foundPost) {
        if (err) {
            res.redirect("/posts");
        } else {
            res.render("posts/edit", {post: foundPost});
        }
    });
});

// UPDATE POST ROUTE
router.put("/:id", function (req, res) {
    // find and update the current post
    Post.findByIdAndUpdate(req.params.id, req.body.post, function (err, updatePost) {
        if (err) {
            res.redirect("/posts");
        } else {
            // redirect show page
            res.redirect("/posts/" + req.params.id);
        }
    });
});

// DESTROY POST ROUTE
router.delete("/:id", function (req, res) {
    Post.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/posts");
        } else {
            res.redirect("/posts");
        }
    });
});

// middleware
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;