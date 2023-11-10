//url for geojson data
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

//use d3 to connect to url and retrieve data
d3.json(url).then(function (data) {
    console.log(data);
    createFeatures(data.features);
});

//function for marker size based on earthquake magnitude
function marker(magnitude) {
    return magnitude * 5;
};

//function for marker color based on earthquake depth
function markerStyle(depth) {
    if (depth >= 90) { return "#EB5E28";
    } else if (depth < 90 && depth >= 70) { return "#f9a03f";
    } else if (depth < 70 && depth >= 50) { return "#f3c053";
    } else if (depth < 50 && depth >= 30) { return "#a1c349";
    } else if (depth < 30 && depth >= 10) { return "#87a330";
    } else { return "#6a8532"; 
    }
};

//function for each data point
function createFeatures(earthquakeData) {

//create popup for each data point showing place, mag and depth
   function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr>
                    <h5>Depth:${feature.geometry.coordinates[2]}</h5>
                    <h5>Magnitude:${feature.properties.mag}</h5>`);
  }

//create layer for each data point and marker design
  let earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
            radius: marker(feature.properties.mag),
            fillColor: markerStyle(feature.geometry.coordinates[2]),
            color: "white",
            weight: 0.5,
            opacity: 1,
            fillOpacity: 0.75
        });
    },
    onEachFeature: onEachFeature
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
};

//create earthquake map
function createMap(earthquakes) {

  // Create the base layer.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      20, 0
    ],
    zoom: 2,
    layers: [street, earthquakes]
  }).addTo(myMap);
  
};