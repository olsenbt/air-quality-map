// initialize basemmap
mapboxgl.accessToken =
    'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    zoom: 4, // starting zoom
    center: [-100, 40], // starting center
    projection: 'albers'
});

// load data and add as layer

async function geojsonFetch() {
    let response = await fetch('assets/map4/myData3.geojson');
    let tractData = await response.json();

    map.on('load', function loadingData() {
        map.addSource('data', {
            type: 'geojson',
            data: tractData
        });

        map.addLayer({
            'id': 'nses_value',
            'type': 'fill',
            'source': 'data',
            'paint': {
                'fill-color': [
                    'step',
                    ['get', 'NSES'],
                    '#fef0d9', // stop_output_0
                    16.61, // stop_input_0
                    '#fde4c3', // stop_output_1
                    38.3, // stop_input_1
                    '#fdbb84', // stop_output_2
                    48.45, // stop_input_2
                    '#fc8d59', // stop_output_3
                    58.12, // stop_input_3
                    '#e34a33', // stop_output_4
                    69.6, // stop_input_4
                    "#b30000", // stop_output_5
                    91.7,
                    "#b30000"
                ],
                'fill-opacity': .7
            }
        });

        const layers = [
            '> 16',
            '16 - 38',
            '38 - 48',
            '48 - 58 <br></br> AFFLUENT',
            '58 - 69',
            '69 - 92 '
        ];
        // #273859|#4a5d83|#6d81ac|#8fa5d6|#b2caff
        const colors = [
            '#fef0d9', '#fde4c3', '#fdbb84', '#fc8d59', '#e34a33', '#b30000'
        ];

        // create legend
        const legend = document.getElementById('legend');
        legend.innerHTML = "<b>Socioeconomic Status Score  </b><br><br>";


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
            `<h3>${state[0].properties.COUNTY} County, Census Tract ${state[0].properties.ses_TRACT}</h3><p><strong><em>${state[0].properties.NSES}</strong> SES Score.</em></p>` :
            `<p>Hover over a county!</p>`;
    });
}


geojsonFetch();
// add the data source
const source =
'<p style="text-align: right; font-size:10pt">Source: <a href="https://www.arcgis.com/home/item.html?id=2a98d90305364e71866443af2c9b5d06">USGS</a></p>';
// combine all the html codes.
legend.innerHTML = labels.join('') + source;
