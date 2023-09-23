const Element = require("../models/element");
const Pokemon = require("../models/pokemon");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all elements.
exports.element_list = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Element list");
  });
  
  // Display detail page for a specific element.
  exports.element_detail = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: Element detail: ${req.params.id}`);
  });
  
  // Display element create form on GET.
  exports.element_create_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Element create GET");
  });
  
  // Handle element create on POST.
  exports.element_create_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Element create POST");
  });
  
  // Display element delete form on GET.
  exports.element_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Element delete GET");
  });
  
  // Handle element delete on POST.
  exports.element_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Element delete POST");
  });
  
  // Display element update form on GET.
  exports.element_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Element update GET");
  });
  
  // Handle element update on POST.
  exports.element_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Element update POST");
  });