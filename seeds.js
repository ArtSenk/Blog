var mongoose = require("mongoose");
var Post = require("./models/post");
var Comment = require("./models/comment");

var data = [
    {
        name: "Freedom in my mind!",
        image: "https://images.unsplash.com/photo-1476527201336-5ec3e1265173?dpr=0.8999999761581421&auto=format&fit=crop&w=767&h=511&q=80&cs=tinysrgb&crop=",
        description: "Beautiful cafe racer"
    }
];

function seedDb() {
    // Remove all posts
    Post.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("removed posts!");
        // Add post
        data.forEach(function (seed) {
            Post.create(seed, function (err, post) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("added post");
                    // Create a comment
                    Comment.create(
                        {
                            text: "Cool Bike!",
                            author: "David"
                        }, function (err, comment) {
                            if (err) {
                                console.log(err);
                            } else {
                                post.comments.push(comment);
                                post.save();
                                console.log("Created new comment");
                            }
                        }
                    );
                }
            })
        });
    });
}

module.exports = seedDb;