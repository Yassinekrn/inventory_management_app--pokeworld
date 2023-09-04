const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const pokemonSchema = new Schema({
    name: { type: String, required: true },
    size: { type: String, required: true, enum: ["Small", "Average", "Big", "Gigantic"],
    default: "Average", }, 
    description: { type: String, required: true },
    attack: { type: Number, required: true },
    defense: { type: Number, required: true },
    health: { type: Number, required: true },
    element: [{ type: Schema.Types.ObjectId, ref: "Element" }],
    avatar: { type: String },
});

// Virtual for book's URL
pokemonSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
    return `/pokeworld/pokemon/${this._id}`;
});

// Export model
module.exports = mongoose.model("Pokemon", pokemonSchema);
