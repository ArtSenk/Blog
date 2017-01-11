var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/usr");

// Start page
router.get("/", function (req, res) {
    //res.render("landing");
    res.redirect("/posts");
});

// Show register form
router.get("/register", function (req, res) {
    res.render("register");
});

// Handling sign up logic
router.post("/register", function (req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome " + user.username);
            res.redirect("/posts");
        });
    });
});

// Show login form
router.get("/login", function (req, res) {
    res.render("login");
});

// Handling login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/posts",
        failureRedirect: "/login"
    }), function (req, res) {
});

// Logout route
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/posts");
});

module.exports = router;