#! /usr/bin/env node
const fs = require('fs');


console.log(
    'This script populates some test pokemons and elements to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const Pokemon = require("./models/pokemon");
  const Element = require("./models/element");
  
  const pokemons = [];
  const elements = [];
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false); // Prepare for Mongoose 7
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    //await createElements();
    await createPokemons();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  async function elementCreate(name) {
    const element = new Element({ name: name });
    await element.save();
    elements.push(element);
    console.log(`Added element: ${name}`);
  }
  
  async function pokemonCreate(name, health, attack, description, defense, size, elements, avatarFilePath) {
    const pokemondetail = { name, health, attack, description, defense, size };
    pokemondetail.element = [];
    if (elements) {
      for (const element of elements) {
        try {
          let foundElement = await Element.findOne({ name: element });
          if (!foundElement) {
            // Create the element if it doesn't exist
            foundElement = await elementCreate(element);
          }
          pokemondetail.element.push(foundElement._id);
        } catch (err) {
          console.error(`Error finding or creating element: ${element}`);
          /* console.error(`Creation of pokemon failed, cancelling: ${name}`);
          return; */
        }
      }
    }
  
    // Read the image file and store it as a Buffer
    const avatarData = fs.readFileSync(avatarFilePath);
    // Determine the content type based on the image file format
  let contentType;
  if (avatarFilePath.endsWith('.png')) {
  contentType = 'image/png';
} else if (avatarFilePath.endsWith('.jpg') || avatarFilePath.endsWith('.jpeg')) {
  contentType = 'image/jpeg';
} else if (avatarFilePath.endsWith('.gif')) {
  contentType = 'image/gif';
} else {
  // Default content type for other formats (you can adjust this)
  contentType = 'application/octet-stream';
}

    // Set the avatar field in the model
    pokemondetail.avatar = {
    data: avatarData,
    contentType: contentType,
    };

    const pokemon = new Pokemon(pokemondetail);
    await pokemon.save();
    pokemons.push(pokemon); 
    console.log(`Added pokemon: ${name} ${health} ${attack} ${description} ${defense} ${size} ${elements} ${avatarFilePath}`);   
  }


  async function createElements() {
    console.log("Adding elements");
    await Promise.all([
        elementCreate("Fire"),
        elementCreate("Water"),
        elementCreate("Grass"),
        elementCreate("Poison"),
        elementCreate("Electric"),
        elementCreate("Ice"),
        elementCreate("Dark"),
    ]);
  }
  
  async function createPokemons() {
    console.log("Adding pokemons");
    await Promise.all([
      //name, health, attack, description, defense, size, element, avatarFilePath
      pokemonCreate('Pikachu', 100, 50, "Electric-type, iconic, with thunderbolt tail.", 40, 'Small', ['Electric'], 'pokemon_images/pikachu.png'),
      pokemonCreate('Charmander', 80, 52, "Fire starter, flame-tailed, evolves into Charizard.", 43, 'Small', ['Fire'], 'pokemon_images/charmander.png'),
      pokemonCreate('Squirtle', 100, 48, "Water-type, turtle-like, evolves into Blastoise.", 65, 'Small', ['Water'], 'pokemon_images/squirtle.png'),
      pokemonCreate('Jigglypuff', 115, 45, "Singing balloon, puts foes to sleep with song.", 20, 'Small', ['Normal', 'Fairy'], 'pokemon_images/jigglypuff.png'),
      pokemonCreate('Snorlax', 160, 110, "Gigantic, sleeping, blocks paths with its size.", 65, 'Huge', ['Normal'], 'pokemon_images/snorlax.png'),
      pokemonCreate('Bulbasaur', 90, 49, "Grass-Poison type, dual-bulb, starter Pokémon in Kanto.", 49, 'Small', ['Grass', 'Poison'], 'pokemon_images/bulbasaur.png'),
    ]);
  }
