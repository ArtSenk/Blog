var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    Post          = require("./models/post"),
    User          = require("./models/usr");

mongoose.connect(process.env.DATABASEURL);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

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
            console.log("ERROR!");
        } else {
            res.render("index", {posts: allPosts});
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
    res.render("new");
});

// Shows more info about one post
app.get("/posts/:id", function (req, res) {
    Post.findById(req.params.id, function (err, foundPost) {
        if (err) {
            res.redirect("/posts");
        } else {
            res.render("show", {post: foundPost});
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