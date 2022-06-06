// initialize basemmap
mapboxgl.accessToken =
  "pk.eyJ1IjoicmVpbmEtb3Jpa2FzYSIsImEiOiJjbDJlamM1OG8wMTh0M2hubGd4dXZ4MzAyIn0.YAmcC3JIRoOVvOiQ9jZxsQ";

const map = new mapboxgl.Map({
  container: "map", // container id
  style: "mapbox://styles/reina-orikasa/cl3kxk0nx000a14qfrmljhhch",
});

map.on("load", () => {
  map.getCanvas().style.cursor = "default";
  const layers = [
    "0 - 14.7",
    "14.8 - 29.3",
    "29.4 - 58.5",
    "58.6 - 73.2",
    "73.3 - 87.8",
    "87.9 - 117",
  ];

  const colors = [
    "#ffffd4",
    "#fee391",
    "#fec44f",
    "#fe9929",
    "#ec7014",
    "#cc4c02",
    "#8c2d04",
  ];

  // create legend
  const legend = document.getElementById("legend");

  layers.forEach((layer, i) => {
    const color = colors[i];
    const item = document.createElement("div");
    const key = document.createElement("div");
    item.className = 'text-xl'
    key.className = `h-4 w-4 rounded-lg inline-block mr-4 bg-2020-${i}`;

    const value = document.createElement("span");
    value.innerHTML = `${layer}`;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
  });
});

map.on("mousemove", (event) => {
  const states = map.queryRenderedFeatures(event.point, {
    layers: ["aqi-2020-v3"],
  });

  document.getElementById("pd").innerHTML = states.length
    ? `<h3>${states[0].properties.NAME} County, ${states[0].properties.STATE_NAME}</h3>
    <p>AQI: ${states[0].properties.aqi}</p>
    `
    : `<p>Hover over a county!</p>`;
});

// 2010 map
const map2 = new mapboxgl.Map({
  container: "map2",
  style: "mapbox://styles/reina-orikasa/cl3l76bem000d14qjc70hitsc",
});

map2.on("load", () => {
  map.getCanvas().style.cursor = "default";
  const layers = [
    "0 - 10.88",
    "10.89 - 21.75",
    "21.76 - 32.63",
    "32.64 - 43.5",
    "43.6 - 62.25",
    "62.26 - 87",
  ];

  const colors = [
    "#ffffd4",
    "#fee391",
    "#fec44f",
    "#fe9929",
    "#ec7014",
    "#cc4c02",
    "#8c2d04",
  ];

  // create legend
  const legend = document.getElementById("legend2");

  layers.forEach((layer, i) => {
    const item = document.createElement("div");
    const key = document.createElement("div");
    item.className = 'text-xl'
    key.className = `h-4 w-4 rounded-lg inline-block mr-4 bg-2020-${i}`;

    const value = document.createElement("span");
    value.innerHTML = `${layer}`;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
  });
});

map2.on("mousemove", (event) => {
  const states = map2.queryRenderedFeatures(event.point, {
    layers: ["aqi-2010"],
  });

  document.getElementById("pd2").innerHTML = states.length
    ? `<h3>${states[0].properties.COUNTYNAME} County, ${states[0].properties.STATE}</h3>
    <p>AQI: ${states[0].properties.aqi}</p>
    `
    : `<p>Hover over a county!</p>`;
});
