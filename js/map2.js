mapboxgl.accessToken = 'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
let map = new mapboxgl.Map({
    container: 'map', // container ID
    projection: 'albers',
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    zoom: 3, // starting zoom
    center: [-100, 40] // starting position [lng, lat]
});

const grades = [1000, 100000, 1000000, 10000000],
    colors = ['rgb(208,209,230)', 'rgb(232, 232, 174)', 'rgb(240, 186, 122)', 'rgb(253,0,0)'],
    radii = [5, 8, 11, 15];


map.on('load', () => {

    map.addSource('data', {
        type: 'geojson',
        data: 'assets/map2/2011_GHG.geojson'
    });

    map.addLayer({
            'id': 'emissionData-point',
            'type': 'circle',
            'source': 'data',
            'paint': {
                // increase the radii of the circle as the zoom level and dbh value increases
                'circle-radius': {
                    'property': 'ghg_quantity',
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
                        }, radii[2]],
                        [{
                            zoom: 5,
                            value: grades[3]
                        }, radii[3]]
                    ]
                },
                'circle-color': {
                    'property': 'ghg_quantity',
                    'stops': [
                        [grades[0], colors[0]],
                        [grades[1], colors[1]],
                        [grades[2], colors[2]],
                        [grades[3], colors[3]],
                    ]
                },
                'circle-stroke-color': 'grey',
                'circle-stroke-width': 1,
                'circle-opacity': 0.6
            }
        },
        'waterway-label'
    );

    // click on tree to view magnitude in a popup
    map.on('click', 'emissionData-point', (event) => {
        new mapboxgl.Popup()
            .setLngLat(event.features[0].geometry.coordinates)
            .setHTML(`<strong>GHG Quantity:</strong> ${event.features[0].properties.ghg_quantity}  (Metric Tons CO2e) \n <strong>Facility Name:</strong> ${event.features[0].properties.FACILITY_NAME}`)
            .addTo(map);
    });

});

// create legend
const legend = document.getElementById('legend');

//set up legend grades and labels
var labels = ['<strong>Emissions (CO2e)'], vbreak;
//iterate through grades and create a scaled circle and label for each
for (var i = 0; i < grades.length; i++) {
vbreak = grades[i];
// you need to manually adjust the radius of each dot on the legend 
// in order to make sure the legend can be properly referred to the dot on the map.
dot_radii = 2 * radii[i];
labels.push(
    '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radii +
    'px; height: ' +
    dot_radii + 'px; "></i> <span class="dot-label" style="top: ' + dot_radii / 2 + 'px;">' + vbreak +
    '</span></p>');

}

legend.innerHTML = labels.join('');