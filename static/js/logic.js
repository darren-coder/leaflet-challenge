// URL for JSON data
const earthquakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Fetch the JSON data 
d3.json(earthquakes).then(function(data) {
    console.log("Data Promise:", data);
    
    let events = data.features;
    console.log("events:", events);

    events.forEach(function(event) {
        let geometry = event.geometry.coordinates;
        

        let latitude = []
        let longitude = []
        let depth = []

        latitude = geometry[1]
        longitude = geometry[0]
        depth = geometry[2]
        console.log(latitude)

    });
    




});

// Collect the data
