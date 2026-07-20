import { defineCustomElements } from '@ionic/core/loader';
defineCustomElements(window);

import '@ionic/core/css/core.css';
import '@ionic/core/css/normalize.css';
import '@ionic/core/css/structure.css';
import '@ionic/core/css/typography.css';
import './theme.css';
// Iconos
import { addIcons } from 'ionicons';
import { home, search, heart, person } from 'ionicons/icons';
addIcons({ home, search, heart, person });

const nombresTabs = {
  inicio: 'Inicio',
  buscar: 'Buscar',
  favoritos: 'Favoritos',
  perfil: 'Perfil'
};

const tabs = document.querySelector('ion-tabs');
const titulo = document.getElementById('tituloBarra');

tabs.addEventListener('ionTabsDidChange', (event) => {
  const tabActivo = event.detail.tab; // ej: "buscar"
  titulo.textContent = nombresTabs[tabActivo];
});

const searchbar = document.getElementById('buscadorPokemon');
const lista = document.getElementById('listaResultados');

searchbar.addEventListener('ionInput', async (event) => {
  const termino = event.target.value.trim().toLowerCase();

  if (termino.length === 0) {
    lista.innerHTML = '';
    return;
  }

  try {
    const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${termino}`);

    if (!respuesta.ok) {
      lista.innerHTML = `
        <ion-item>
          <ion-label color="danger">No se encontró ningún Pokémon con ese nombre</ion-label>
        </ion-item>
      `;
      return;
    }

    const data = await respuesta.json();
    mostrarPokemon(data);

  } catch (error) {
    console.error('Error al buscar Pokémon:', error);
    lista.innerHTML = `
      <ion-item>
        <ion-label color="danger">Error de conexión</ion-label>
      </ion-item>
    `;
  }
});

function mostrarPokemon(data) {
  const nombre = data.name.charAt(0).toUpperCase() + data.name.slice(1);
  const imagen = data.sprites.front_default;
  const tipos = data.types.map(t => t.type.name).join(', ');

  lista.innerHTML = `
    <ion-item>
      <ion-avatar slot="start">
        <img src="${imagen}" alt="${nombre}" />
      </ion-avatar>
      <ion-label>
        <h2>${nombre}</h2>
        <p>Tipo: ${tipos}</p>
        <p>Peso: ${data.weight} | Altura: ${data.height}</p>
      </ion-label>
    </ion-item>
  `;
}