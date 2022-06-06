// initialize basemmap
mapboxgl.accessToken =
'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/light-v10', // style URL
zoom: 3.25, // starting zoom
center: [-100, 40] // starting center
});

// load data and add as layer
async function geojsonFetch() {
let response = await fetch('assets/map3/data.geojson');
let countyData = await response.json();

map.on('load', function loadingData() {
    map.addSource('data', {
        type: 'geojson',
        data: countyData
    });

    map.addLayer({
        'id': 'countyData-layer',
        'type': 'fill',
        'source': 'data',
        'paint': {
            'fill-color': [
                'step',
                ['get', 'Pct_Change'],
                '#FFEDA0',   // stop_output_0
                18,          // stop_input_0
                '#FEB24C',   // stop_output_1
                51,          // stop_input_1
                '#FC4E2A',   // stop_output_2
                79,         // stop_input_2
                '#E31A1C',   // stop_output_3
                114,         // stop_input_3
                '#BD0026',   // stop_output_4
                225,        // stop_input_4
                "#800026"    // stop_output_5
            ],
            'fill-outline-color': '#BBBBBB',
            'fill-opacity': 0.7,
        }
    });

    const layers = [
        '< 17',
        '18-50',
        '51-78',
        '79-114',
        '114-224',
        '225 and more'
    ];
    const colors = [
        '#FFEDA070',
        '#FEB24C70',
        '#FC4E2A70',
        '#E31A1C70',
        '#BD002670',
        '#80002670'
    ];

    // create legend
    const legend = document.getElementById('legend');
    legend.innerHTML = "<b>Mortality Rate Change<br>(%)</b><br><br>";


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

map.on('mousemove', ({point}) => {
    const state = map.queryRenderedFeatures(point, {
        layers: ['countyData-layer']
    });
    document.getElementById('text-escription').innerHTML = state.length ?
        `<h3>${state[0].properties.crd_Field1}</h3><p><strong><em>${state[0].properties.Pct_Change}</strong>% change</em></p>` :
        `<p>Mortality rate % change is for 1985-2014.
        Hover over a county!</p>
        <p style="text-align: right; font-size:10pt">Source: <a href="https://ghdx.healthdata.org/record/ihme-data/united-states-chronic-respiratory-disease-mortality-rates-county-1980-2014">The Global Health Data Exchange</a></p>`;
});
}

geojsonFetch();