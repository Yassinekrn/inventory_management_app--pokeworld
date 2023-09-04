
// Require Mongoose
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const elementSchema = new Schema({
    name: { name: String , required: true, maxLength: 100, minLength: 3 },
});

elementSchema.virtual("url").get(function () {
    return `/elements/${this._id}`;
});

// Export function to create "SomeModel" model class
module.exports = mongoose.model("Element", elementSchema);
