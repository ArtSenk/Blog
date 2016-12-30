var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Post", postSchema);