var bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    express    = require("express"),
    app        = express();

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

app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/blogs", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log("ERROR!");
        } else {
            res.render("index", {blogs: blogs});
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

app.listen(process.env.PORT || 3000, process.env.IP);