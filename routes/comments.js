var express = require("express");
var router = express.Router({mergeParams: true});
var Post = require("../models/post");
var Comment = require("../models/comment");

// Comments New
router.get("/new", isLoggedIn, function (req, res) {
    // Find post by id
    Post.findById(req.params.id, function (err, post) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {post: post});
        }
    });
});

// Comments Create
router.post("/", function (req, res) {
    // Lookup campground using ID
    Post.findById(req.params.id, function (err, post) {
        if (err) {
            console.log(err);
            res.redirect("/posts");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    post.comments.push(comment);
                    post.save();
                    res.redirect('/posts/' + post._id);
                }
            });
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