// HTML Full Screen Overlay with Text Javascript code 
// display html overlay this is the default, which is why it appears on load
function on() {
	document.getElementById("overlay").style.display = "block";
}
//click to turn off the overlay, to turn it back on the page needs to be refreshed -- this is the desired functionality
function off() {
	document.getElementById("overlay").style.display = "none";
}

// Use Mapbox JS API to set up default style of map - dark-v10
mapboxgl.accessToken = 'pk.eyJ1IjoiY29sbGFicHJvamVjdDE5MDgiLCJhIjoiY2p0ZWdwMjl1MWhsYzQ5bzlvdzBmOW13OCJ9.e9FtSFxY-nswnnCgtFXonA';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/dark-v10', // stylesheet location
    center: [-63.331663,44.781492],
    zoom: 8.5
});

//bounds for the zoom defaults
//to nova scotia -- want to change to guelph
document.getElementById('fit-nb').addEventListener('click', function() {
	map.fitBounds([
		[-66.623242,43.232046],
		[-59.331133,47.263642]
	]);
});
// to halifax -- can stay as is
document.getElementById('fit-default').addEventListener('click', function() {
	map.fitBounds([
		[-64.278313,44.379177],
		[-62.106446,45.334063]
	]);
});
// zooms into building levels -- may be removed
document.getElementById('fit-buildings').addEventListener('click', function() {
	map.fitBounds([
		[-63.612531,44.650415],
		[-63.606300,44.653094]
	]);
});
//sets up the geocoder - sets the extent for the geocoder
var geocoder = new MapboxGeocoder({
	accessToken: mapboxgl.accessToken,
	placeholder: 'Search',
	bbox: [-64.318199, 44.400115, -62.177113, 45.323049], // set to halifax
	proximity: { // shows only the nearest location with that address to this coordinate
		longitude: -63.331663,
		latitude: 44.781492
	}
}); 

map.addControl(geocoder); //adds geocoder functionality to the map

map.on('load', function() { // loads basemap
	
	map.addLayer({
		'id': 'halifax-db',  //dissemination block
		'type': 'fill',
		'source': {
			'type': 'geojson',
			'data': 'Halifax_DB.geojson'
		},
		'layout': {
			'visibility': 'visible'
		},
		'paint': {
			'fill-color': 'rgba(244,220,66,0)',
			'fill-outline-color': '#f4dc42'
		}
	});

	map.addLayer({
		'id': 'halifax-da',  //dissemination area
		'type': 'fill',
		'source': {
				'type': 'geojson',
				'data': 'Halifax_DA.geojson'
		},
		'layout': {
				'visibility': 'visible'
		},
		'paint': {
				'fill-color': 'rgba(110,242,33,0)',
				'fill-outline-color': '#6ef221'
		}
	});

	map.addLayer({  //adding max and min zoom levels
		'id': 'halifax-odb',   //buildings
		'type': 'fill',
		'source': {
				'type': 'geojson',
				'data': 'Halifax_ODB.geojson'
		},
		'layout': {
				'visibility': 'visible'
		},
		'paint': {
				'fill-color': '#f2f7e3'
		}
	});

	map.addSource('single-point', {  //creates an empty geojson file in cache to store point from geocoder, points do not get overwritten until refresh
		type: 'geojson',
		data: {
			type: 'FeatureCollection',
			features: []
		}
	});
	
	map.addLayer({  //adding geocoded point
		id: 'point',
		source: 'single-point',
		type: 'circle',
		paint: {
			'circle-radius': 5,
			'circle-color': '#448ee4'
		}
	});
	
	geocoder.on('result', function(e) {  //gets dropdown  in search and sends coordinates to cached geojson file
		map.getSource('single-point').setData(e.result.geometry);
	});

});

// creates the extent for on click zoom to feature
function fit(bbox) {
	map.fitBounds(bbox, {padding: 20});
}

//https://gis.stackexchange.com/questions/186533/highlight-feature-with-click-in-mapbox-gl
//variable to hold current zoom level features, currently hard-coded
var selFeat = 'halifax-odb'; //may need to be coded by zoom number?
//function selects and highlights a single feature in the current zoom level
map.on('click', function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: [selFeat] });

    if (!features.length) {
        return;
    }
    if (typeof map.getLayer('selectedFeature') !== "undefined" ){         
        map.removeLayer('selectedFeature')
        map.removeSource('selectedFeature');   
    }
    var feature = features[0];
    //builds structure for the summary statistics box based on which layer is the active layer
    if (selFeat == 'halifax-odb') {    
    document.getElementById('sumstats').innerHTML = '<div><h3>Summary of Statistics and Data</h3></div><div><h4>Building ID Number</h4></div><div><p id="IDno"></p></div><div><h4>Building Area</h4></div><div><p><span id="area"></span><span> m<sup>2</sup></span></p></div>';
} else if (selFeat == 'halifax-db') {
    document.getElementById('sumstats').innerHTML = '<div><h3>Summary of Statistics and Data</h3></div><div><h4>Dissemination Block ID</h4></div><div><p id="IDno"></p></div><div><h4>Building Count</h4></div><div><p id="count"></p></div>';} 
    else if (selFeat == 'halifax-da') {
document.getElementById('sumstats').innerHTML = '<div><h3>Summary of Statistics and Data</h3></div><div><h4>Dissemination Area ID</h4></div><div><p id="IDno"></p></div><div><h4>Building Count</h4></div><div><p id="count"></p></div><div><h4>Average Building Area</h4></div><div id="avgarea"></div>';};
    //fill the summary statistics box with data based on which layer is the active layer and by referencing attributes in the geojson object selected
    if (selFeat == 'halifax-odb') {
    document.getElementById('IDno').innerHTML = feature.properties.Build_ID; //fills the html div with content
    //MUST BE AFTER the var feature declaration
    document.getElementById('area').innerHTML = feature.properties.Shape_Area;}; //check geojson file for the attributes available

    console.log(feature.toJSON()); // not sure what this line does but does not impact functionality
    map.addSource('selectedFeature', {
        "type":"geojson",
        "data": feature.toJSON()
    });
    map.addLayer({
        "id": "selectedFeature",
        "type": "line",
        "source": "selectedFeature",
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": { //styling of selection
            "line-color": "yellow",
            "line-width": 5
        }
    });
    var bbox = turf.extent(feature);
  fit(bbox);
});

// Change cursor to a pointer when the mouse is over the building footprints on hover
map.on('mouseenter', 'halifax-odb', function () {
	map.getCanvas().style.cursor = 'pointer';
});

// Change cursor back when it leaves hover
map.on('mouseleave', 'halifax-odb', function() {
	map.getCanvas().style.cursor = '';
});

// Add navigational controls to the map
map.addControl(new mapboxgl.NavigationControl());

// Toggle data layers on and off
var toggleableLayerIds = ['halifax-db','halifax-da','halifax-odb'];  //links to addLayer above

for (var i=0; i<toggleableLayerIds.length;i++) {
	var id = toggleableLayerIds[i];

	var link = document.createElement('a');
	link.href = '#';
	link.className = 'active';
	link.textContent = id;

	link.onclick = function (e) {
		var clickedLayer = this.textContent;
		e.preventDefault();
		e.stopPropagation();

		var visibility = map.getLayoutProperty(clickedLayer,'visibility');

		if (visibility == 'visible') {
			map.setLayoutProperty(clickedLayer,'visibility','none');
			this.className = '';
		} else {
			this.className = 'active';
			map.setLayoutProperty(clickedLayer,'visibility','visible');
		}
	};

	var layers = document.getElementById('toggle-menu');
	layers.appendChild(link);
}