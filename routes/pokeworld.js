const express = require("express");
const router = express.Router();

// Require controller modules.
const pokemon_controller = require("../controllers/pokemonController");
const element_controller = require("../controllers/elementController");

/// pokemon ROUTES ///

// GET pokeworld home page.
router.get("/", pokemon_controller.index);

// GET request for creating a pokemon. NOTE This must come before routes that display pokemon (uses id).
router.get("/pokemon/create", pokemon_controller.pokemon_create_get);

// POST request for creating pokemon.
router.post("/pokemon/create", pokemon_controller.pokemon_create_post);

// GET request to delete pokemon.
router.get("/pokemon/:id/delete", pokemon_controller.pokemon_delete_get);

// POST request to delete pokemon.
router.post("/pokemon/:id/delete", pokemon_controller.pokemon_delete_post);

// GET request to update pokemon.
router.get("/pokemon/:id/update", pokemon_controller.pokemon_update_get);

// POST request to update pokemon.
router.post("/pokemon/:id/update", pokemon_controller.pokemon_update_post);

// GET request for one pokemon.
router.get("/pokemon/:id", pokemon_controller.pokemon_detail);

// GET request for list of all pokemon items.
router.get("/pokemons", pokemon_controller.pokemon_list);


/// element ROUTES ///

// GET request for creating a element. NOTE This must come before route that displays element (uses id).
router.get("/element/create", element_controller.element_create_get);

//POST request for creating element.
router.post("/element/create", element_controller.element_create_post);

// GET request to delete element.
router.get("/element/:id/delete", element_controller.element_delete_get);

// POST request to delete element.
router.post("/element/:id/delete", element_controller.element_delete_post);

// GET request to update element.
router.get("/element/:id/update", element_controller.element_update_get);

// POST request to update element.
router.post("/element/:id/update", element_controller.element_update_post);

// GET request for one element.
router.get("/element/:id", element_controller.element_detail);

// GET request for list of all element.
router.get("/elements", element_controller.element_list);

module.exports = router;
