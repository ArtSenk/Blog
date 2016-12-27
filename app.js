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

// MONGOOSE CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

// PASSPORT CONFIGURATION
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

app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/blogs", function (req, res) {
    Blog.find({}, function (err, allBlogs) {
        if (err) {
            console.log("ERROR!");
        } else {
            res.render("index", {blogs: allBlogs});
        }
    });
});

app.get("/blogs/:id", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

// AUTH ROUTES
// show register form
app.get("/register", function (req, res) {
    res.render("register");
});
// handle sign up logic
app.post("/register", function (req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/blogs")
        });
    });
});

// show login form
app.get("/login", function (req, res) {
    res.render("login");
});
// handling login logic
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/blogs",
        failureRedirect: "/login"
    }), function (req, res) {
});

// logic route
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/blogs");
});

app.listen(process.env.PORT || 3000, process.env.IP);