
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
        // Style for the markers
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
// Making the map
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

// define geoJSON file
let techtonicGeo = "./techtonic_plates.json";
// Fetch the geoJSON data
fetch(techtonicGeo)
  .then(response => response.json())  // Parse the response as JSON
  .then(data => {
    console.log("Techtonic Plates Data:", data);  // Log the actual GeoJSON data

    // Now you can add the GeoJSON to the map
    let overlayMaps = {
        "Techtonic Plates": L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, styleFeature(feature));
            }
        }).addTo(map)
    };

    // Add geoJSON to the layers control
    L.control.layers(baseMaps, overlayMaps).addTo(map);
})
  .catch(error => {
    console.error("Error loading GeoJSON file:", error);
  });

// Styling for geoJSON layer
function styleFeature(feature) {
    return {
        radius: 6,
        fillColor: "#800080",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
}

// make the Legend
let legend = L.control({ position: 'bottomright' });

legend.onAdd = function(map) {
    let div = L.DomUtil.create('div', 'info legend');
    // Styling for Legend
    div.style.backgroundColor = "#ffffff";
    div.style.padding = "10px";
    div.style.border = "1px solid #ccc";
    div.style.borderRadius = "5px";
   
    
    // Content for legend
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

// Add legend to map
legend.addTo(map);



    




