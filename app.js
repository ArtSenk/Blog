var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    User          = require("./models/usr");

mongoose.connect(process.env.DATABASEURL);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// Mongoose config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

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
app.get("/blogs", function (req, res) {
    Blog.find({}, function (err, allBlogs) {
        if (err) {
            console.log("ERROR!");
        } else {
            res.render("index", {blogs: allBlogs});
        }
    });
});

// Shows more info about one post
app.get("/blogs/:id", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
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
        successRedirect: "/blogs",
        failureRedirect: "/login"
    }), function (req, res) {
});

// Logic route
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/blogs");
});

app.listen(process.env.PORT || 3000, process.env.IP);