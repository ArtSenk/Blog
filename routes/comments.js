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
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    post.comments.push(comment);
                    post.save();
                    console.log(comment);
                    res.redirect('/posts/' + post._id);
                }
            });
        }
    });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", checkCommentOwnership, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {post_id: req.params.id, comment: foundComment});
        }
    });
});

// COMMENT UPDATE ROUTE
router.put("/:comment_id", checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updateComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/posts/" + req.params.id);
        }
    });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", checkCommentOwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/posts/" + req.params.id);
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

function checkCommentOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                // does user own the comment?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;