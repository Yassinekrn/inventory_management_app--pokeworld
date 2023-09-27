const Element = require("../models/element");
const Pokemon = require("../models/pokemon");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all elements.
exports.element_list = asyncHandler(async (req, res, next) => {
    let element_list = await Element.find().exec();
    if (req.query.search)
      element_list = element_list.filter(element => element.name.toLowerCase().includes(req.query.search.toLowerCase() || ""));
    let search_input = req.query.search || "";
    res.render("element_list", { element_list, search_input });
  });
  
  // Display detail page for a specific element.
  exports.element_detail = asyncHandler(async (req, res, next) => {
    const element = await Element.findById(req.params.id).exec();
    const pokemon_list = await Pokemon.find({ element: req.params.id }, "name description avatar").exec();
    res.render("element_detail", { element, pokemon_list });
  });
  
  // Display element create form on GET.
  exports.element_create_get = asyncHandler(async (req, res, next) => {
    res.render("element_form", { title: "Create Element" });
  });
  
  // Handle element create on POST.
  exports.element_create_post = [
    // Validate and sanitize the name field.
    body("name", "Element name must contain at least 3 characters")
        .trim()
        .isLength({ min: 3 })
        .escape(),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
      // Extract the validation errors from a request.
        const errors = validationResult(req);

      // Create an element object with escaped and trimmed data.
        const element = new Element({ name: req.body.name });

        if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render("element_form", {
            title: "Create Element",
            element: element,
            errors: errors.array(),
        });
        return;
    } else {
        // Data from form is valid.
        // Check if element with same name already exists.
        const elementExists = await Element.findOne({ name: req.body.name }).exec();
        if (elementExists) {
          // element exists, redirect to its detail page.
            res.redirect(elementExists.url);
        } else {
            await element.save();
          // New element saved. Redirect to element detail page.
            res.redirect(element.url);
        }
    }
    }),
];
  
  // Display element delete form on GET.
  exports.element_delete_get = asyncHandler(async (req, res, next) => {
    const pokemon_list = await Pokemon.find({ element: req.params.id }, "name").exec();
    const element = await Element.findById(req.params.id).exec();
    res.render("element_delete", { title: "Delete Element", pokemon_list, element })
  });
  
  // Handle element delete on POST.
  exports.element_delete_post = asyncHandler(async (req, res, next) => {
    const pokemon_list = await Pokemon.find({ element: req.params.id }, "name").exec();
    const element = await Element.findById(req.params.id).exec();
    if (pokemon_list.length > 0) {
      res.render("element_delete", { title: "Delete Element", pokemon_list, element, errors: ["Element has associated pokemon. Delete pokemon first."] });
    } else {
      await Element.findByIdAndDelete(element._id);
      const redirectUrl = `${req.protocol}://${req.get('host')}/pokeworld/elements`;
      res.redirect(redirectUrl);
    }
  });
  
  // Display element update form on GET.
  exports.element_update_get = asyncHandler(async (req, res, next) => {
    const element = await Element.findById(req.params.id).exec();
    res.render("element_form", { title: "Update Element", element });
  });
  
  // Handle element update on POST.
  exports.element_update_post = [
    // Validate and sanitize the name field.
    body("name", "Element name must contain at least 3 characters")
        .trim()
        .isLength({ min: 3 })
        .escape(),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
      // Extract the validation errors from a request.
        const errors = validationResult(req);

      // Create an element object with escaped and trimmed data.
        const element = new Element({_id: req.params.id , name: req.body.name });

        if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render("element_form", {
            title: "Update Element",
            element: element,
            errors: errors.array(),
        });
        return;
    } else {
        // Data from form is valid.
        // Check if element with same name already exists.
        const elementExists = await Element.findOne({ name: req.body.name }).exec();
        if (elementExists) {
          // element exists, redirect to its detail page.
            res.render("element_form", {
              title: "Update Element",
              element: element,
              errors: ["Element's name already in use. Please choose another name."],
          });
        } else {
            const updatedElement = await Element.findByIdAndUpdate(req.params.id, element, {});
            // Redirect to Element detail page.
            res.redirect(updatedElement.url);
        }
    }
    }),
];