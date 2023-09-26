const Element = require("../models/element");
const Pokemon = require("../models/pokemon");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const element = require("../models/element");

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
  // Get details of pokemons and element counts (in parallel)
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
          if (typeof req.body.element === "undefined") req.body.element = [];
          else req.body.element = new Array(req.body.element);
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
    const pokemon = await Pokemon.findById(req.params.id).populate("element").exec();
    res.render("pokemon_delete", { title: "Delete Pokemon", pokemon })
  });
  
  // Handle pokemon delete on POST.
  exports.pokemon_delete_post = asyncHandler(async (req, res, next) => {
    try {
      // Delete the Pokémon document from the database
      await Pokemon.findByIdAndRemove(req.params.id);
  
      // Redirect to the desired URL
      const redirectUrl = `${req.protocol}://${req.get('host')}/pokeworld/pokemons`;
      res.redirect(redirectUrl);
    } catch (err) {
      console.error('Error deleting Pokémon:', err);
      // Handle any errors that occur during the deletion process
      res.status(500).send('Internal Server Error');
    }
    
  });
  /* HERE BRO DONT GET LOST !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
  // Display pokemon update form on GET.
  exports.pokemon_update_get = asyncHandler(async (req, res, next) => {
    const elements = await Element.find().exec();
    const pokemon = await Pokemon.findById(req.params.id).populate("element").exec();

    if (pokemon === null) {
      // No results.
      const err = new Error("Pokemon not found");
      err.status = 404;
      return next(err);
    }

    // Success.
    res.render("pokemon_form", {
        title: "Create Pokemon",
        elements: elements,
        pokemon: pokemon,
    });
  });
  
  // Handle pokemon update on POST.
  exports.pokemon_update_post = [
    upload.single('image'),
    // Convert the element to an array.
    (req, res, next) => {
      if (!(req.body.element instanceof Array)) {
          if (typeof req.body.element === "undefined") req.body.element = [];
          else req.body.element = new Array(req.body.element);
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
  
        // Create a Pokemon object with escaped and trimmed data.
          const pokemon = new Pokemon({
            _id: req.params.id,
            name: req.body.name,
            size: req.body.size,
            description: req.body.description,
            attack: req.body.attack,
            defense: req.body.defense,
            health: req.body.health,
            element: req.body.element,
          });

        if (req.file) {
          // If a new image was uploaded, update the avatar.
          pokemon.avatar = {
            data: fs.readFileSync(path.join(__dirname + '/../pokemon_images/' + req.file.filename)),
            contentType: 'image/png',
          };
        }

  
          if (!errors.isEmpty()) {
          // There are errors. Render form again with sanitized values/error messages.
  
          // Get all elements for form.
          const elements = await Element.find().exec();
  
          res.render("pokemon_form", {
              title: "Update Pokemon",
              elements: elements,
              pokemon: pokemon,
              errors: errors.array(),
          });
          return;
      } else {
          // Data from form is valid. Update the Pokemon.
        const updatedPokemon = await Pokemon.findByIdAndUpdate(req.params.id, pokemon, {});
        // Redirect to Pokemon detail page.
        res.redirect(updatedPokemon.url);
      }
      }),
  ]