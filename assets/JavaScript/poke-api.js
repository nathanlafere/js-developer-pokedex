
const pokeApi = {};

function ConvertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name
    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types
    pokemon.types = types
    pokemon.type = type
    pokemon.sprite = pokeDetail.sprites.other.dream_world.front_default
    pokemon.height = pokeDetail.height;
    pokemon.weight = pokeDetail.weight;
    pokemon.abilities = pokeDetail.abilities.map((abilities => abilities.ability.name));
    pokemon.status = pokeDetail.stats.map((status => status.base_stat));  // [hp,attack,defense,special-attack,special-defense,speed]
    return pokemon
}

pokeApi.getPokemonByName = (name) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${name}/`
    return fetch(url)
        .then((response) => response.json())
        .then(ConvertPokeApiDetailToPokemon)  
}

pokeApi.filterPoke = (pokemon) => {
    if (pokemon.name.slice(0, inputVal.length) == inputVal) {
        return true
    }
    else {
        false
    }
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(ConvertPokeApiDetailToPokemon)
}

pokeApi.getPokemonsWinput = (offset, limit) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => {
            return pokemonsDetails.map((x) => {
                if (x.name.slice(0, inputVal.length) == inputVal) {
                    return x
                }
            })
        });
}



pokeApi.getPokemons = (offset, limit) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}
