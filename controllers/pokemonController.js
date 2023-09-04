const Element = require("../models/element");
const Pokemon = require("../models/pokemon");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all pokemons.
exports.pokemon_list = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Pokemon list");
  });
  
  // Display detail page for a specific pokemon.
  exports.pokemon_detail = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: Pokemon detail: ${req.params.id}`);
  });
  
  // Display pokemon create form on GET.
  exports.pokemon_create_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Pokemon create GET");
  });
  
  // Handle pokemon create on POST.
  exports.pokemon_create_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Pokemon create POST");
  });
  
  // Display pokemon delete form on GET.
  exports.pokemon_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Pokemon delete GET");
  });
  
  // Handle pokemon delete on POST.
  exports.pokemon_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Pokemon delete POST");
  });
  
  // Display pokemon update form on GET.
  exports.pokemon_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Pokemon update GET");
  });
  
  // Handle pokemon update on POST.
  exports.pokemon_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Pokemon update POST");
  });