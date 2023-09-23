const Element = require("../models/element");
const Pokemon = require("../models/pokemon");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

//storage
// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'pokemon_images/'); // Define the upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Define the file name
  },
});
const upload = multer({ storage: storage });

exports.index = asyncHandler(async (req, res, next) => {
  // Get details of pokemons and genre counts (in parallel)
  const [
  numPokemons,
  numElements,
  ] = await Promise.all([
    Pokemon.countDocuments({}).exec(),
    Element.countDocuments({}).exec()
  ]);

  res.render("index", {
  title: "Pokeworld Home",
  element_count: numElements,
  pokemon_count: numPokemons
  });
});

// Display list of all pokemons.
exports.pokemon_list = asyncHandler(async (req, res, next) => {
  const pokemon_list = await Pokemon.find({}, 'name description element avatar').populate("element").exec();
  res.render("pokemon_list", { title: "Pokemon List", pokemon_list });
  });
  
  // Display detail page for a specific pokemon.
  exports.pokemon_detail = asyncHandler(async (req, res, next) => {
    const pokemon = await Pokemon.findById(req.params.id).populate("element").exec();
    res.render("pokemon_detail", { title: "Pokemon Detail", pokemon });
  });
  
  // Display pokemon create form on GET.
  exports.pokemon_create_get = asyncHandler(async (req, res, next) => {
    const elements = await Element.find().exec();
    res.render("pokemon_form", { title: "Create Pokemon", elements });
  });
  
  // Handle pokemon create on POST.
  exports.pokemon_create_post = [
    upload.single('image'),
    // Convert the element to an array.
    (req, res, next) => {
      if (!(req.body.element instanceof Array)) {
          if (typeof req.body.element === "undefined") req.body.genre = [];
          else req.body.genre = new Array(req.body.genre);
      }
      next();
      },
  
      // Validate and sanitize fields.
      body("name", "Name must not be empty.")
          .trim()
          .isLength({ min: 1 })
          .escape(),
      body("size", "Size must not be empty.")
          .trim()
          .isLength({ min: 1 })
          .escape(),
      body("description", "description must not be empty.")
          .trim()
          .isLength({ min: 1 })
          .escape(),
      body("attack", "attack must not be empty").isInt({ min: 1 }).escape(),
      body("defense", "defense must not be empty").isInt({ min: 1 }).escape(),
      body("health", "health must not be empty").isInt({ min: 1 }).escape(),
      body("element.*").escape(),
      // Process request after validation and sanitization.
  
      asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
          const errors = validationResult(req);
  
        // Create a Book object with escaped and trimmed data.
          const pokemon = new Pokemon({
            name: req.body.name,
            size: req.body.size,
            description: req.body.description,
            attack: req.body.attack,
            defense: req.body.defense,
            health: req.body.health,
            element: req.body.element,
            avatar: {
              data: fs.readFileSync(path.join(__dirname + '/../pokemon_images/' + req.file.filename)),
              contentType: 'image/png'
            }
      });
  
          if (!errors.isEmpty()) {
          // There are errors. Render form again with sanitized values/error messages.
  
          // Get all elements for form.
          const elements = await Element.find().exec();
  
          /* // Mark our selected genres as checked.
          for (const element of elements) {
              if (pokemon.element.includes(element._id)) {
              element.checked = "true"; 
          }
          }*/
          res.render("pokemon_form", {
              title: "Create Pokemon",
              elements: elements,
              pokemon: pokemon,
              errors: errors.array(),
          });
      } else {
          // Data from form is valid. Save book.
          await pokemon.save();
          res.redirect(pokemon.url);
      }
      }),
  ]
  
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