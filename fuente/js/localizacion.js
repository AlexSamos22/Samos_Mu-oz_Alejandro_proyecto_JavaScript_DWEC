// inicializamos el mapa y estableceremos su vista en nuestras coordenadas geográficas elegidas y un nivel de zoom:
var map = L.map('map').setView([37.18817,  -3.60667], 18);

//agregar un mosaico al mapa
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//Agregar marcador de localizacion al mapa
var marker = L.marker([37.18817,  -3.60667]).addTo(map);

//Agregar un texto al marcador anterior
marker.bindPopup("<b>Estoy aqui").openPopup();