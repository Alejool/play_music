
import canciones from './canciones.js';
let isPlaying = false; 
let cancion_id = 0;
let position_id = 0;
let cancion = [];
let tiempoPausa = 0;
let isDragging = false;

const audio = document.querySelector('.card__audio');
const img = document.querySelector('.card__img');
const artist = document.querySelector('.card__artist');
const title = document.querySelector('.card__title');
const play = document.querySelector('.card__play');
const duracionT = document.querySelector('.card__timeF');
const duracionU = document.querySelector('.card__timeI');
const barraProgreso = document.querySelector('.card__progress');
const barraTotal = document.querySelector('.card__barTtotal');

document.addEventListener('DOMContentLoaded', () => {
  cargaPrimeraCancion();

   audio.addEventListener('loadedmetadata', function() {
    duracionCancion();
   });

    audio.addEventListener('timeupdate', function() {
     updateTimeRepro();
     updateBarraProgress();
    });

    barraTotal.addEventListener('mousedown', (e) => 
    {
      let totalTime = barraTotal.dataset.time;

      // //console.log(totalTime);
      const clicX = e.clientX - barraTotal.getBoundingClientRect().left;
      const porcentaje = clicX / barraTotal.offsetWidth;
      const tiempoClic = totalTime * porcentaje;
      audio.currentTime = tiempoClic;
      tiempoPausa = tiempoClic;
      // console.log(tiempoClic);
      updateBarraProgress();
   
    });


  document.querySelector('.card__play').addEventListener('click', () => {
    PlayMusic();
  });

  document.querySelector('.card__next').addEventListener('click', () => {
    nextMusic();
  } );

  document.querySelector('.card__prev').addEventListener('click', () => {
    prevMusic();
  });

});


// Función para calcular el porcentaje de la posición del clic
// function calcularPorcentaje(clicX) {
//   const barraProgresoAncho = barraProgreso.offsetWidth;
//   return Math.min(1, Math.max(0, clicX / barraProgresoAncho));
// }


function updateBarraProgress() {
  const progreso = (audio.currentTime / audio.duration) * 100;

  barraProgreso.style.width = progreso + '%'; // Agregamos '%' para definir el porcentaje
  barraProgreso.style.background = `linear-gradient(to right, #a4166b ${progreso}%, #a4166f 0%)`;
  barraProgreso.style.borderRadius = '100rem'; // Borde redondeado

  // Detener la animación antes de aplicarla nuevamente
  barraProgreso.style.animation = 'none';

  // Aplicar la animación a la barra de progreso
  barraProgreso.style.animation = 'progress 1.5s linear infinite';
  barraProgreso.style.animationPlayState = 'running';

  // Verificar si la canción ha alcanzado el 100% de progreso
  if (progreso === 100) {
      nextMusic(); // Llamar a la función para pasar a la siguiente canción
  }
}


// update time number
function updateTimeRepro()
{
  let tiempoActual = audio.currentTime;

  let minutos = Math.floor(tiempoActual / 60);
  let segundos = Math.floor(tiempoActual % 60);

  minutos = (minutos < 10) ? '0' + minutos : minutos;
  segundos = (segundos < 10) ? '0' + segundos : segundos;

  duracionU.textContent = minutos + ':' + segundos;
}


// update song duration
function duracionCancion()
{
  let duracionCancion = audio.duration;
  barraTotal.dataset.time = duracionCancion;

  let minutos = Math.floor(duracionCancion / 60);
  let segundos = Math.floor(duracionCancion % 60);

    minutos = (minutos < 10) ? '0' + minutos : minutos;
    segundos = (segundos < 10) ? '0' + segundos : segundos;
    duracionT.textContent = minutos + ':' + segundos;
}


// prev song
function prevMusic()
{
  isPlaying = false;
  tiempoPausa = 0;
  cancion_id = parseInt(audio.dataset.playing);
  cancion_id--;

  if(cancion_id <= 0)
  {
    cancion_id = parseInt(canciones.length);
  }

  searchCancion();
  agregateCancion();
 

}


// agregate song
function agregateCancion(reproducir = true) 
{
  img.src = cancion[0].bg;
  title.textContent = cancion[0].name;
  artist.textContent = cancion[0].artist;
  audio.src = cancion[0].src;
  audio.dataset.playing = cancion[0].id;
  duracionCancion();
  playStopMusic(reproducir);
}

// next song
function nextMusic() {
  isPlaying = false;
  tiempoPausa = 0;
  cancion_id = parseInt(audio.dataset.playing);
  cancion_id++;

  if (cancion_id > canciones.length) {
    cancion_id = 1;  
  }

    searchCancion();
    agregateCancion();
   
 

}


function searchCancion()
{
  cancion = canciones.filter(elemento => elemento.id === cancion_id);
  //console.log(cancion);

}



function cargaPrimeraCancion() {
  cancion_id=1;
  tiempoPausa = 0;
  searchCancion();
  agregateCancion(false);
  


}


// ten en cuenta debe ser un numero el id
function PlayMusic() {
  
   cancion_id = parseInt(audio.dataset.playing);
  
  searchCancion();
  playStopMusic();  
}


function playStopMusic(activar = true) {

  // console.log('activadno' + activar + 'isPlaying' + isPlaying);


  // console.log(tiempoPausa);
  if (activar && !isPlaying) {

    if (tiempoPausa > 0) {
      audio.currentTime = tiempoPausa; 
  }
    audio.play(); 
    play.src = './public/img/svg/pause.svg'
    isPlaying = true; 

  } else if (activar && isPlaying) {
    audio.pause(); 
    tiempoPausa = audio.currentTime;
    play.src = './public/img/svg/Play_fill.svg'
    isPlaying = false; 
  }

}

