//import {User} from './pokemonTrainer.js'

const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

//create pokemon trainer card form inside of main tag
document.addEventListener("DOMContentLoaded",()=> {
  displayTrainersPokemon()
})

//make GET request to fetch all trainers object and inside their pokemon
function displayTrainersPokemon(){
  fetch("http://localhost:3000/trainers")
  .then(response => response.json() )
  .then(arrayTrainerObjects => iterateTrainersPokemon(arrayTrainerObjects))
}

function iterateTrainersPokemon(arrayTrainerObjects){
  arrayTrainerObjects.forEach((entry)=> displayATrainersWithPokemon(entry));
}
function displayATrainersWithPokemon(entry){
  //add div container to main tag
  let mainTag = document.querySelector("main");

  //div container for trainer and its pokemon entries
  let divContainingATrainer = createDivContainerForTrainer(entry);

  //add trainer name in p element with divTrainerContainer
  let trainerName = createTrainerName(entry);

  //add pokemon button
  let addPokemonButton = createAddPokemonButton(entry);

  //ul for each trainers pokemon consist of li entries
  let ulOfTrainer = createTrainerPokemonList();

  //create li entry for each pokemon
  let arrayEntryPokemons = entry.pokemons
  arrayEntryPokemons.forEach((pokemonEntry) => {aPokemonEntry(pokemonEntry,ulOfTrainer)} );

  //add elements to DOM
  divContainingATrainer.append(trainerName, addPokemonButton,ulOfTrainer)
  mainTag.appendChild(divContainingATrainer)
}

function createDivContainerForTrainer(entry){
  let divTrainerContainer = document.createElement("div");
  divTrainerContainer.classList.add("card");
  //  divTrainerContainer.dataset.id = entry.id;
  divTrainerContainer.dataset.trainerId = entry.id;
  return divTrainerContainer;
}

function createTrainerName(entry){
  let trainerName = document.createElement("p");
  trainerName.innerText = entry.name;
  return trainerName;
}

function createAddPokemonButton(entry){
  let addPokemonButton = document.createElement("button");
  addPokemonButton.dataset.id = entry.id;
  addPokemonButton.innerText = "Add Pokemon";
  addPokemonButton.addEventListener("click", addPokemonButtonEvent )
  return addPokemonButton;
}

function createTrainerPokemonList(){
  let trainerPokemonParty = document.createElement("ul");
  return trainerPokemonParty;
}

function aPokemonEntry(pokemonEntry,ulOfTrainer){
  //use a for each loop to create an li for each of that trainer POKEMONS
  // bundle those li together and return it.
  let aPokemonListEntry = document.createElement("li");
  let releasePokemonButton = document.createElement("button");
  releasePokemonButton.classList.add("release");
  releasePokemonButton.innerText = "Release";
  releasePokemonButton.dataset.pokemonId = pokemonEntry.id;
  releasePokemonButton.addEventListener("click", releasePokemonButtonEvent)
  aPokemonListEntry.innerText = `${pokemonEntry.nickname} (${pokemonEntry.species})`
  aPokemonListEntry.append(releasePokemonButton);
  //append created li element to this trainer ul element
  ulOfTrainer.appendChild(aPokemonListEntry);
}



function releasePokemonButtonEvent(){
  let pokemonID = event.currentTarget.dataset.pokemonId
  return fetch(`http://localhost:3000/pokemons/${pokemonID}`, {
    method: "DELETE"
  })
  .then(resp => resp.json())
  .then(data => {
    deletePokemon(data)
  })
}

function deletePokemon(data){
  if(data.error){
    alert(`${data.error}`)
  }else{
    let trainerID = data.trainer_id
    let pokemonID = data.id
    let divPokemonTrainer = document.querySelector(`[data-trainer-id='${trainerID}']`)
    //acces the li entry of this pokemons
    let liOfPokemon= divPokemonTrainer.querySelector(`[data-pokemon-id='${pokemonID}']`)
    //replace innerhtml with blank
    liOfPokemon.parentElement.innerHTML = ""
  }
}

function addPokemonButtonEvent(){
  //make a post request to add Pokemon
  fetch('http://localhost:3000/pokemons', {
    method: "POST",
    headers:
    {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(
      {
        "trainer_id": event.currentTarget.dataset.id
      })
    }).then(res => res.json())
    .then(data => addPokemon(data))
  }

  function addPokemon(data){
    //if user already has 6 alert user you already have 6 POKEMONS
    // else add the pokemon
    if(data.error){
      alert(`${data.error}`)
    }else{
    let trainerID = data.trainer_id
    let divPokemonTrainer = document.querySelector(`[data-trainer-id='${trainerID}']`)
    let ulCurrentPokemonTrainer= divPokemonTrainer.querySelector("ul")
    aPokemonEntry(data,ulCurrentPokemonTrainer)
  }
}
