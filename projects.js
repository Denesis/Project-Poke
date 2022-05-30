// https://pokeapi.co/api/v2/pokemon/?offset=0&limit=151
const allPokemons = [];

const parsePokemon = () => {};

const getAllPokemons = async () => {
  for (let id = 1; id <= 20; id++) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const pokeJson = await response.json();
    allPokemons.push(pokeJson);
  }
};

const printPokemons = (pokemonsToPrint) => {
  const webPokeDiv = document.querySelector("#webPoke");

  const pokeElements = pokemonsToPrint.map((pokemon) => {
    const pokeBasicInfo = document.createElement("div");
    const pokeContainerInfo = document.createElement('div')
    const pokeContainer = document.createElement('div')
    pokeContainerInfo.className = 'sideBar__card'
    pokeBasicInfo.className = "basic__card";
    pokeContainer.className = "container__card";
    const typesPoke = pokemon.types.map(({ type }) => {
      return `<div class="types__item types__item-${type.name}">${type.name}</div>`;
    });
    const pokeInfo = pokemon.stats.map(({base_stat,stat}) => {
      return `<div class="stat">${stat.name} ${base_stat.url}</div>`;
    })
    console.log(pokeInfo);

    pokeBasicInfo.innerHTML = `
      <div class="description__card" >
        <div class="id">${pokemon.id}</div>
        <div class="title">${pokemon.name}</div>
        <div class="types">
        ${typesPoke.join(" ")}
        </div>
      </div>

      <div class="img">
        <img src="${
          pokemon.sprites.other["official-artwork"].front_default
        }" alt="${pokemon.name}">
      </div>
    `;
    // pokeContainerInfo.innerHTML=
    
    return pokeBasicInfo;
  });

  webPokeDiv.append(...pokeElements);
};

const searchByQuery = () => {
  document
    .querySelector("#search-input")
    .addEventListener("input", ({ target }) => {
      if (!target.value) {
        clean();
        printPokemons(allPokemons);
        return;
      }

      const filteredByQuery = allPokemons.filter(
        ({ name, id }) =>
          name.includes(target.value) || String(id).includes(target.value)
      );

      clean();
      printPokemons([...new Set(filteredByQuery)]);
    });
};

const searchByType = () => {
  const filterDivs = document.querySelectorAll(".selectors__item");

  filterDivs.forEach((filterDiv) => {
    filterDiv.addEventListener("click", ({ target }) => {
      clean();
      const typeClass = target.innerHTML; // ['types__selector', 'dark']

      if (typeClass === "all") {
        printPokemons(allPokemons);
        return;
      }

      const filteredByClick = allPokemons.filter(({ types }) => {
        const finded = types.find(({ type }) => type.name === typeClass);
        return finded;
      });

      printPokemons(filteredByClick);
    });
  });
};

const clean = () => {
  document.querySelector("#webPoke").innerHTML = "";
};

async function init() {
  await getAllPokemons();
  printPokemons(allPokemons);
  searchByQuery();
  searchByType();
}

init();
