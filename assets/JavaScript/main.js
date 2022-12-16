const checkBox = document.getElementById('check');
const buttonBack = document.getElementById('Back');
const buttonNext = document.getElementById('Next');
const modal = document.getElementById("modal-background");
const searchInputPoke = document.getElementById('Search');
const pokemonList = document.getElementById("pokemonList");
const loading = document.getElementById('loading')
const body = document.querySelector("body");
let inputVal = false;
let pokePerScroll = 6;
let pokePerPage = 3;
let offset = 0;
let typingTimer;
let doneTypingInterval = 500;

// mediaQuerry
const mediaQuery_340px = window.matchMedia('(min-width: 340px)')
if (mediaQuery_340px.matches) {
    document.getElementsByClassName('title')[0].style.fontSize = "72px"
    pokePerScroll = 10;
    pokePerPage = 6;
}
const mediaQuery_393px = window.matchMedia('(min-width: 393px)')
if (mediaQuery_393px.matches) {
    pokePerScroll = 12;
    pokePerPage = 8;
}
const mediaQuery576px = window.matchMedia('(min-width: 576px)')
if (mediaQuery576px.matches) {
    searchInputPoke.style.visibility = "visible";
    pokePerPage = 9;
    pokePerScroll = 21;
}
const mediaQuery768px = window.matchMedia('(min-width: 768px)')
if (mediaQuery768px.matches) {
    document.getElementById('pokemon-detail-all').style.gridTemplateColumns = "1fr 2fr"
    searchInputPoke.style.visibility = "visible";
    pokePerPage = 12;
    pokePerScroll = 21;
}
const mediaQuery992px = window.matchMedia('(min-width: 992px)')
if (mediaQuery992px.matches) {
    pokePerPage = 16;
    pokePerScroll = 28;
}

// Função para entender que parou de digitar e chamar a função da pesquisa
searchInputPoke.addEventListener('keyup', () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
});

// Pesquisa por número
function SearchByNum(value) {
    pokeApi.getPokemons(value-1, 1).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML = newHtml;
    });
}

// EventListener verificando as alterações do text input, e chamando a pesquisa para cada alteração
function doneTyping() {
    if (searchInputPoke.value) {
        if (checkBox.checked) {
            document.getElementById('Back').style.visibility = "hidden";
            document.getElementById('Next').style.visibility = "hidden";
            if (!isNaN(searchInputPoke.value) && searchInputPoke.value <= 251) {
                SearchByNum(searchInputPoke.value)
            } else {
                inputVal = searchInputPoke.value.toLowerCase();
                offset = 0;
                loadPokemonItensPage(offset, pokePerPage);
            }
        } else {
            loading.innerText = ""
            if (!isNaN(searchInputPoke.value) && searchInputPoke.value <= 251) {
                SearchByNum(searchInputPoke.value)
            } else {
                inputVal = searchInputPoke.value.toLowerCase();
                offset = 0;
                pokemonList.innerHTML = "";
                loadPokemonItens(offset, pokePerScroll);
            }
        }
    }
    if (!searchInputPoke.value) {
        if (checkBox.checked) {
            document.getElementById('Back').style.visibility = "visible";
            document.getElementById('Next').style.visibility = "visible";
            offset = 0;
            inputVal = false;
            loadPokemonItensPage(offset, pokePerPage);
        } else {
            offset = 0;
            inputVal = false;
            pokemonList.innerHTML = "";
            loadPokemonItens(offset, pokePerScroll);
        }
    }
}

// Função para chamar no onmouseover, para destacar o pokemon quando passar o mouse sobre
function backgroundHighlight(poke) {
    poke.style = "filter: brightness(1.03);";
    poke.style.backgroundImage = `linear-gradient(to top, ${window.getComputedStyle(poke).backgroundColor} 60%, #0e2cee 110%)`;
}

// Função para chamar no onmouseout, para voltar o pokemon ao normal quando o mouse sair dele
function backgroundToNormal(poke) {
    poke.style = "filter: brightness(1);";
    poke.style.backgroundImage = `linear-gradient(to top, ${window.getComputedStyle(poke).backgroundColor} 60%, #0e2cee 100%)`;
}

// Chamando tela de detalhes do pokemons
function showDetails(name) {
    body.style.overflow = "hidden";
    const title = document.getElementById("title");
    const typeDetails = document.getElementsByClassName("pokemon-detail-information-type")[0];
    pokeApi.getPokemonByName(name)
        .then((pokemon) => {
            const newTitleHtml = convertPokemonToDetailStats(pokemon);
            title.innerHTML = newTitleHtml;
            const newTypeHtml = convertPokemonToDetailType(pokemon);
            typeDetails.innerHTML = newTypeHtml
        })
    modal.style.display = "flex";
}

// Fechando os detalhes do pokemon quando clicar no X
document.getElementById("close").onclick = function () {
    body.style.overflow = "auto";
    modal.style.display = "none";
}
// Fechando os detalhes do pokemon quando clicar fora da msg
document.getElementById("modal-background").onclick = function (event) {
    if (event.target == modal) {
        body.style.overflow = "auto";
        modal.style.display = "none";
    }
}

// Colocando as informações para o html
function convertPokemonToLi(pokemon) {
    return `
    <li class="pokemon ${pokemon.type}" onclick="showDetails('${pokemon.name}')" onmouseover="backgroundHighlight(this)" onmouseout="backgroundToNormal(this)">
        <span class="number">#${("0000" + pokemon.number).slice(-4)}</span>
        <span class="name">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</span>
        <div class="detail">
            <ol class="types">
                ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
            </ol>
            <img src="${pokemon.sprite}"
                alt="${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}">
        </div>
    </li>`
}
function convertPokemonToDetailStats(pokemon) {
    const statsTabel = ['hp','atq','def','satq','sdef','spd']
    document.getElementById('pokemon-detail-img').setAttribute("src",pokemon.sprite);
    for (let i = 0; i < statsTabel.length; i++) {
        document.documentElement.style.setProperty(`--my-end-width-${statsTabel[i]}`, `${120-pokemon.status[i]/2}px`);   
    }
    return `
    <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} N°${("000" + pokemon.number).slice(-3)}</h2>
    `
}
function convertPokemonToDetailType(pokemon) {
    let geracao = 1;
    if (pokemon.number > 151) {
        geracao = 2;
    }
    
    return `
    <div class="top-information">
        <div class="left-information">
            Altura
            <p>${pokemon.height/10} m</p>
            Peso
            <p>${pokemon.weight/10} kg</p>
        </div>
        <div class="right-information">
            Habilidades
            <ul class="habilities-list">
                ${pokemon.abilities.map((habilidade) => `<li class="habilidade">${habilidade}</li>`).join('')}
            </ul>
            ${geracao}ª Geração
        </div>
    </div>
    <div class="details-type">
        Tipo
        <ul class="types">
            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
        </ul>
    </div>
    `
}

// Carregamento da interface paginada
function loadPokemonItensPage(offset, pokePerPage) {
    passList = [];
    if (searchInputPoke.value) {
        offset = 0;
        // Poderia ter chamado todos de uma vez, mas de começo pensei em pegar apenas até conseguir preencher uma página, dps percebi que não tem tantos pokemons assim em 2 gerações
        while (offset < 251) {
            if (offset + pokePerPage > 251) {
                pokePerPage = 251 - offset;
            }
            pokeApi.getPokemonsWinput(offset, pokePerPage)
                .then((pokemons) => {
                    for (let i = 0; i < pokemons.length; i++) {
                        if (pokemons[i]) {
                            passList.push(pokemons[i]);
                        }
                    }
                    return passList
                }).then((Passpokemons) => {
                    const newHtml = Passpokemons.map(convertPokemonToLi).join('');
                    pokemonList.innerHTML = newHtml;
                });
            offset += pokePerPage;
        }
    } else {
        pokeApi.getPokemons(offset, pokePerPage).then((pokemons = []) => {
            const newHtml = pokemons.map(convertPokemonToLi).join('');
            pokemonList.innerHTML = newHtml;
        })
    }
}

// Carregamento da interface scroll
function loadPokemonItens(offset, pokePerScroll) {
    passList = [];
    if (searchInputPoke.value) {
        offset = 0;
        // Poderia ter chamado todos de uma vez, mas de começo pensei em pegar apenas até conseguir preencher uma página, dps percebi que não tem tantos pokemons assim em 2 gerações
        while (offset < 251) {
            if (offset + pokePerScroll > 251) {
                pokePerScroll = 251 - offset;
            }
            pokeApi.getPokemonsWinput(offset, pokePerScroll)
                .then((pokemons) => {
                    for (let i = 0; i < pokemons.length; i++) {
                        if (pokemons[i]) {
                            passList.push(pokemons[i]);
                        }
                    }
                    return passList
                }).then((Passpokemons) => {
                    const newHtml = Passpokemons.map(convertPokemonToLi).join('');
                    pokemonList.innerHTML = newHtml;
                });
            offset += pokePerScroll;
        }
    } else {
        pokeApi.getPokemons(offset, pokePerScroll).then((pokemons = []) => {
            const newHtml = pokemons.map(convertPokemonToLi).join('');
            pokemonList.innerHTML += newHtml;
        });
    }
}

// Botões da interface de paginação, caso o checkBox esteja desmarcado, eles estaram escondidos
buttonBack.onclick = function () {
    if (offset - pokePerPage >= 0) {
        offset -= pokePerPage;
        loadPokemonItensPage(offset, pokePerPage);
    }
}
buttonNext.onclick = function () {
    if (offset + pokePerPage < 251) {
        offset += pokePerPage;
        if (offset + pokePerPage > 251) {
            let over = pokePerPage + offset - 251;
            loadPokemonItensPage(offset, pokePerPage - over);
        } else {
            loadPokemonItensPage(offset, pokePerPage);
        }
    }
}

// Chamando a interface de acordo com a checkBox estar ou não marcada
checkBox.onclick = function () {
    if (checkBox.checked) {
        loading.innerText = ""
        offset = 0;
        loadPokemonItensPage(offset, pokePerPage);
        document.getElementById('Back').style.visibility = "visible";
        document.getElementById('Next').style.visibility = "visible";

    } else {
        offset = 0;
        pokemonList.innerHTML = "";
        loadPokemonItens(offset, pokePerScroll);
        document.getElementById('Back').style.visibility = "hidden";
        document.getElementById('Next').style.visibility = "hidden";
    }
}

// EventListener para capturar movimento do scroll, e caso o scroll atingir o valor de altura do documento, carregar mais pokemons
onscroll = () => {
    if (checkBox.checked === false && !inputVal) {
        loading.innerText = `Loading ...`
    }
    if (window.innerHeight + Math.round(window.pageYOffset) === document.documentElement.scrollHeight && checkBox.checked === false && !inputVal) {
        if (offset + pokePerScroll < 251) {
            offset += pokePerScroll;
            if (offset + pokePerScroll > 251) {
                let over = offset + pokePerScroll - 251;
                loadPokemonItens(offset, pokePerScroll - over);
            } else {
                loadPokemonItens(offset, pokePerScroll);
            }
        }
    }
}

// Chamando a primeira leva de pokemons
loadPokemonItens(offset, pokePerScroll);