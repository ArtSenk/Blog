var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    Post          = require("./models/post"),
    Comment       = require("./models/comment"),
    User          = require("./models/usr"),
    seedDB        = require("./seeds");

mongoose.connect(process.env.DATABASEURL);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
seedDB();

// Passport configuration
app.use(require("express-session")({
    secret: "Fucking secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

// Start page
app.get("/", function (req, res) {
    res.render("landing");
});

// Show all posts
app.get("/posts", function (req, res) {
    Post.find({}, function (err, allPosts) {
        if (err) {
            console.log(err);
        } else {
            res.render("posts/index", {posts: allPosts});
        }
    });
});

app.post("/posts", function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newPost = {name: name, image: image, description: desc};

    Post.create(newPost, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/posts");
        }
    });
});

app.get("/posts/new", function (req, res) {
    res.render("posts/new");
});

// Shows more info about one post
app.get("/posts/:id", function (req, res) {
    Post.findById(req.params.id).populate("comments").exec(function (err, foundPost) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundPost);
            res.render("posts/show", {post: foundPost});
        }
    });
});

// Comments Routes
app.get("/posts/:id/comments/new", function (req, res) {
    // Find post by id
    Post.findById(req.params.id, function (err, post) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {post: post});
        }
    });
});

app.post("/posts/:id/comments", function (req, res) {
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

// Show login form
app.get("/login", function (req, res) {
    res.render("login");
});
// Handling login logic
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/posts",
        failureRedirect: "/login"
    }), function (req, res) {
});

// Logic route
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/posts");
});

app.listen(process.env.PORT || 3000, process.env.IP);