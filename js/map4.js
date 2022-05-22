// initialize basemmap
mapboxgl.accessToken =
   'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
const map = new mapboxgl.Map({
       container: 'map', // container ID
       style: 'mapbox://styles/mapbox/light-v10', // style URL
       zoom: 4, // starting zoom
       center: [-100, 40], // starting center
       //projection: 'albers'
   });

   // load data and add as layer
   async function geojsonFetch() {
       let response = await fetch('assets/map4/gge.geojson');
       let countData = await response.json();

       map.on('load', function loadingData() {
           map.addSource('nses', {
               type: 'geojson',
               data: 'assets/map4/gge.geojson'
           });

           map.addLayer({
               'id': 'nses_value',
               'type': 'fill',
               'source': 'nses',
               'paint': {
                   'fill-color': [
                       'step',
                       ['get', 'nses_index'],
                       '#fcf0bb', // stop_output_0
                       38.0, // stop_input_0
                       '#FED976', // stop_output_1
                       58.0, // stop_input_1
                       '#FEB24C', // stop_output_2
                       76.0, // stop_input_2
                       '#FD8D3C', // stop_output_3
                       97.0, // stop_input_3
                       '#fc4b26', // stop_output_4
                       139, // stop_input_4
                       '#800026', // stop_output_5
                       291, // stop_input_5
                       '#730022'
                       /*,   // stop_output_6
                                          193214,        // stop_input_6
                                          "#800026",    // stop_output_7
                                          756413,
                                          "#730022"*/
                   ],
                   'fill-outline-color': '#BBBBBB',
                   'fill-opacity': 0.7,
               }
           });

           const layers = [
               '4 - 37',
               '37 - 57',
               '57 - 76',
               '76 - 97',
               '97 - 139',
               '139 - 291'
           ];
           const colors = [
               '#fcf0bb70',
               '#FED97670',
               '#FEB24C70',
               '#FD8D3C70',
               '#fc4b2670',
               '#80002670',
               "#73002270"
               /*,
                         '#BD002670',
                         "#73002270"*/
           ];

           // create legend
           const legend = document.getElementById('legend');
           legend.innerHTML = "<b>Socioeconomic Status Index Value </b><br><br>";


           layers.forEach((layer, i) => {
               const color = colors[i];
               const item = document.createElement('div');
               const key = document.createElement('span');
               key.className = 'legend-key';
               key.style.backgroundColor = color;

               const value = document.createElement('span');
               value.innerHTML = `${layer}`;
               item.appendChild(key);
               item.appendChild(value);
               legend.appendChild(item);
           });
       });

       map.on('mousemove', ({
           point
       }) => {
           const state = map.queryRenderedFeatures(point, {
               layers: ['nses_value']
           });
           document.getElementById('text-escription').innerHTML = state.length ?
               `<h3>${state[0].properties.county}, ${state[0].properties.state}:</h3><p><strong><em>${state[0].properties.nses_index}</strong>% Index value.</em></p>` :
               `<p>Hover over a county!</p>`;
       });
   }

   geojsonFetch();
   // add the data source
   const source =
       '<p style="text-align: right; font-size:10pt">Source: <a href="https://www.arcgis.com/home/item.html?id=2a98d90305364e71866443af2c9b5d06">USGS</a></p>';
   // combine all the html codes.
   legend.innerHTML = labels.join('') + source;