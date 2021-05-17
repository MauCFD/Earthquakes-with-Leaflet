let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(queryUrl, function(data) {
  mapFeatures(data.features);
});

function mapFeatures(eqInfo) {
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place + "</h3>" +
    "<br><p>" + new Date(feature.properties.time) + "</p>" +
    "<br><p>Magnitude of " + feature.properties.mag + "</p>");
  }
  
  let earthquakes = L.geoJSON(eqInfo, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      let color;
      let r = Math.floor(255-80*feature.properties.mag);
      let g = Math.floor(255-80*feature.properties.mag);
      let b = 255;
      color= "rgb(" + r + ", " + g + ", " + b + ")"
      
      let geojsonMarkerOptions = {
        radius: 3*feature.properties.mag,
        fillColor: color,
        color: "white",
        weight: 1,
        opacity: 0.5,
        fillOpacity: 0.8
      };
      return L.circleMarker(latlng, geojsonMarkerOptions);
    }
  });
  
  mapGeneration(earthquakes);
}

function mapGeneration(earthquakes) {
  let streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  })

  let starterMap = {
    "Street Map": streetmap
  };

  let newLayerMap = {
    Earthquakes: earthquakes
  };
  
  let myMap = L.map("map", {
    center: [0, 0],
    zoom: 2,
    layers: [streetmap, earthquakes]
  });
  
  function getColor(d) {
    return d < 1 ? 'rgb(255,255,255)' :
    d < 2  ? 'rgb(225,225,255)' :
    d < 3  ? 'rgb(195,195,255)' :
    d < 4  ? 'rgb(165,165,255)' :
    d < 5  ? 'rgb(135,135,255)' :
    d < 6  ? 'rgb(105,105,255)' :
    d < 7  ? 'rgb(75,75,255)' :
    d < 8  ? 'rgb(45,45,255)' :
    d < 9  ? 'rgb(15,15,255)' :
    'rgb(0,0,255)';
  }
  
  let legend = L.control({position: 'bottomleft'});
  
  legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'info legend'),
      mags = [0, 1, 2, 3, 4, 5, 6, 7, 8],
      labels = [];
      
      div.innerHTML+='Magnitude<br><hr>'
      
      for (let i = 0; i < mags.length; i++) {
        div.innerHTML +=
        '<i style="background:' + getColor(mags[i] + 1) + '">&nbsp</i> ' +
        mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
      }
  
      return div;
    };

    legend.addTo(myMap);
  }