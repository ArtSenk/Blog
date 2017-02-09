var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    flash          = require("connect-flash"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    User           = require("./models/usr"),
    seedDB         = require("./seeds");

// requiring routes
var postRoutes    = require("./routes/posts"),
    commentRoutes = require("./routes/comments"),
    indexRoutes   = require("./routes/index");

mongoose.connect(process.env.DATABASEURL);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

// Passport configuration
app.use(require("express-session")({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// set "showTests" context property if the querystring contains test=1
app.use(function (req, res, next) {
    res.locals.showTests = app.get("env") !== "production" &&
            req.query.test === "1";
    next();
});

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/posts", postRoutes);
app.use("/posts/:id/comments", commentRoutes);

app.listen(process.env.PORT || 3000, process.env.IP);