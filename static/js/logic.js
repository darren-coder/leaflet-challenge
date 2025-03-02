
// URL for JSON data
const earthquakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Fetch the JSON data 
d3.json(earthquakes).then(function(data) {
    console.log("Data Promise:", data);
    // Create lists
    let magnitudes = [];
    let latitudes = [];
    let longitudes = [];
    let depths = [];
    let places = []
    // Loop with forEach
    data.features.forEach(function(feature) {
        // Fill with data
        let magnitude = feature.properties.mag;
        magnitudes.push(magnitude);        
        let latitude = feature.geometry.coordinates[1];
        latitudes.push(latitude);
        let longitude = feature.geometry.coordinates[0];
        longitudes.push(longitude);
        let depth = parseFloat(feature.geometry.coordinates[2].toFixed(2));
        depths.push(depth);
        let place = feature.properties.place;
        places.push(place);
    });    
    // Log into console
    console.log("Magnitudes:", magnitudes);
    console.log("Latitudes:", latitudes);
    console.log("Longitudes:", longitudes);
    console.log("Depths:", depths);
    console.log("Places:", places);
    // Set color scale
    function getColor(depth) {
        return depth >= 90 ? '#BD0026' : 
            depth >= 70 ? '#F03B20' : 
            depth >= 50 ? '#FD8D3C' : 
            depth >= 30 ? '#FEB24C' : 
            depth >= 10 ? '#FED976' :
            '#FFFFB2';    
    }
    // Loop through lists, make markers and add pop-ups.
    for (let i = 0; i < latitudes.length; i++) {
        let lat = latitudes[i];
        let lon = longitudes[i];
        let mag = magnitudes[i];
        let depth = depths[i];
        let place = places[i];

        L.circleMarker([lat, lon], {
            radius: mag * 4, 
            fillColor: getColor(depth),
            color: 'black',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.7
        })
        .bindPopup(`<h3>${place}</h3><p>Magnitude: ${mag}<br>Depth: ${depth} km</p>`)
        .addTo(map);
    }    
});
// Add tile layer  
let usMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
// Set map
let map = L.map('map').setView([37.09, -95.71], 4);
// Add tile layer
usMap.addTo(map);

let baseMaps = {
    "US MAP": usMap
};

L.control.layers(baseMaps).addTo(map);

let legend = L.control({ position: 'bottomright' });

legend.onAdd = function(map) {
    let div = L.DomUtil.create('div', 'info legend');

    div.style.backgroundColor = "#ffffff";
    div.style.padding = "10px";
    div.style.border = "1px solid #ccc";
    div.style.borderRadius = "5px";
   
    
    // Set up the legend content. You can add more items here with different colors or descriptions.
    div.innerHTML = `
        <h4>Depth (km)</h4>
        <i style="background: #ffffb2; width: 18px; height: 18px; display: inline-block; margin-right: 5px;"></i> -10-10<br>
        <i style="background: #fed976; width: 18px; height: 18px; display: inline-block; margin-right: 5px;"></i> 10-30<br>
        <i style="background: #feb24c; width: 18px; height: 18px; display: inline-block; margin-right: 5px;"></i> 30-50<br>
        <i style="background: #fd8d3c; width: 18px; height: 18px; display: inline-block; margin-right: 5px;"></i> 50-70<br>
        <i style="background: #f03b20; width: 18px; height: 18px; display: inline-block; margin-right: 5px;"></i> 70-90<br>
        <i style="background: #bd0026; width: 18px; height: 18px; display: inline-block; margin-right: 5px;"></i> 90+<br>


    `;
    return div;
};

// Add the legend to the map
legend.addTo(map);



    




