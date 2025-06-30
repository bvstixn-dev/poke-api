let currentPokemonId = 1; 

//Buscar con enter
document.getElementById('pokemonInput').addEventListener('keypress', function(e){
  if (e.key === 'Enter'){
    buscarPokemon();
  }

});


async function buscarPokemon() {
  const input = document.getElementById('pokemonInput').value.toLowerCase();
  const container = document.getElementById('pokemonContainer');
  container.innerHTML = 'Buscando...';

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`);
    if (!res.ok) throw new Error("No encontrado");
    const data = await res.json();

    currentPokemonId = data.id; 

    mostrarPokemon(data);
  } catch (error) {
    container.innerHTML = `<p>Pokémon no encontrado. Intenta con otro nombre o número.</p>`;
  }
}



async function mostrarPokemon(data) {
  const container = document.getElementById('pokemonContainer');
  
  
  //Descripcion
  let descripcion = "Descripción no disponible.";
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${data.name}`);
    const speciesData = await res.json();
    const entrada = speciesData.flavor_text_entries.find(
      entry => entry.language.name === "es"
    );
    if (entrada) {
      descripcion = entrada.flavor_text.replace(/\f|\n/g, ' ');
    }
  } catch (error) {
    console.error("Error al obtener descripción:", error);
  }



  const stats = data.stats.map(stat => {
    const nombre = traducirStat(stat.stat.name);
    const valor = stat.base_stat;
    const porcentaje = Math.min(valor, 100); // Máximo 100%

    return `
      <p><strong>${nombre}:</strong> ${valor}</p>
      <div class="progress mb-2">
        <div class="progress-bar" role="progressbar" style="width: ${porcentaje}%;" aria-valuenow="${valor}" aria-valuemin="0" aria-valuemax="150">
          ${valor}
        </div>
      </div>
    `;
    }).join('');


    container.innerHTML = `
    <h2>${data.name.toUpperCase()}</h2>
    <img src="${data.sprites.front_default}" alt="${data.name}">
    <p><strong>Tipo:</strong> ${data.types.map(t => `<span class="type ${t.type.name}">${t.type.name}</span>`).join(' ')}</p>
    <p><strong>Altura:</strong> ${data.height / 10} m</p>
    <p><strong>Peso:</strong> ${data.weight / 10} kg</p>
    <h3>Estadísticas:</h3>
    ${stats}

    <h2>Descripción<h2>
    <p class="descripcion">${descripcion}</p>





  `;
}


async function cambiarPokemon(delta) {
  const newId = currentPokemonId + delta;
  if (newId < 1 || newId > 1025) return; 

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${newId}`);
    if (!res.ok) throw new Error("Error");
    const data = await res.json();
    currentPokemonId = data.id;
    mostrarPokemon(data);
  } catch (error) {
    console.error("Error al cargar Pokémon:", error);
  }
}


function traducirStat(statName) {
  const traducciones = {
    'hp': 'HP',
    'attack': 'Ataque',
    'defense': 'Defensa', 
    'special-attack': 'Ataque Esp.',
    'special-defense': 'Defensa Esp.',
    'speed': 'Velocidad'
  };
  return traducciones[statName] || statName;
}
