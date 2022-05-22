// initialize basemmap
mapboxgl.accessToken =
    'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    zoom: 3, // starting zoom
    center: [-100, 40] // starting center
});

const grades = [10000, 20000, 100000],
    colors = ['rgb(208,209,230)', 'rgb(120,120,0)', 'rgb(253,0,0)'],
    radii = [5, 10, 15];

// load data and add as layer
async function geojsonFetch() {
    let response = await fetch('assets/map3/2011_GHG.geojson');
    let countyData = await response.json();

    map.on('load', function loadingData() {

        map.addSource('data', {
            type: 'geojson',
            data: 'assets/map3/2011_GHG.geojson'
        });

        map.addLayer({
                'id': 'emissionData-layer',
                'type': 'circle',
                'source': 'data',
                'paint': {
                    // increase the radii of the circle as the zoom level and dbh value increases
                    'circle-radius': {
                        'property': 'cases',
                        'stops': [
                            [{
                                zoom: 5,
                                value: grades[0]
                            }, radii[0]],
                            [{
                                zoom: 5,
                                value: grades[1]
                            }, radii[1]],
                            [{
                                zoom: 5,
                                value: grades[2]
                            }, radii[2]]
                        ]
                    },
                    'circle-color': {
                        'property': 'cases',
                        'stops': [
                            [grades[0], colors[0]],
                            [grades[1], colors[1]],
                            [grades[2], colors[2]]
                        ]
                    },
                    'circle-stroke-color': 'white',
                    'circle-stroke-width': 1,
                    'circle-opacity': 0.6
                }
            },
            'waterway-label'
        );

        // click on tree to view magnitude in a popup
        map.on('click', 'covid-point', (event) => {
            new mapboxgl.Popup()
                .setLngLat(event.features[0].geometry.coordinates)
                .setHTML(`<strong>GHG Quantity:</strong> ${event.features[0].properties.cases}  (METRIC TONS CO2e)`)
                .addTo(map);
        });

        // create legend
        const legend = document.getElementById('legend');
        legend.innerHTML = "<b>Emission by Facillity<br>(%)</b><br><br>";


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
            layers: ['emissionData-layer']
        });
        document.getElementById('text-escription').innerHTML = state.length ?
            `<h3>${state[0].properties.crd_Field1}</h3><p><strong><em>${state[0].properties.Pct_Change}</strong>% change</em></p>` :
            `<p>Mortality rate % change is for 1985-2014.
        Hover over a county!</p>
        <p style="text-align: right; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">The New York Times</a></p>`;
    });
}

geojsonFetch();