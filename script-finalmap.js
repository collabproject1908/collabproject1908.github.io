// HTML Full Screen Overlay with Text Javascript code 
function on() {
	document.getElementById("overlay").style.display = "block";
}

function off() {
	document.getElementById("overlay").style.display = "none";
}

// Use Mapbox JS API to create a map
mapboxgl.accessToken = 'pk.eyJ1IjoiY29sbGFicHJvamVjdDE5MDgiLCJhIjoiY2p0ZWdwMjl1MWhsYzQ5bzlvdzBmOW13OCJ9.e9FtSFxY-nswnnCgtFXonA';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/dark-v10', // stylesheet location
    center: [-63.331663,44.781492],
    zoom: 8.5
});

document.getElementById('fit-nb').addEventListener('click', function() {
	map.fitBounds([
		[-66.623242,43.232046],
		[-59.331133,47.263642]
	]);
});

document.getElementById('fit-default').addEventListener('click', function() {
	map.fitBounds([
		[-64.278313,44.379177],
		[-62.106446,45.334063]
	]);
});

document.getElementById('fit-buildings').addEventListener('click', function() {
	map.fitBounds([
		[-63.612531,44.650415],
		[-63.606300,44.653094]
	]);
});

var geocoder = new MapboxGeocoder({
	accessToken: mapboxgl.accessToken,
	placeholder: 'Search',
	bbox: [-64.318199, 44.400115, -62.177113, 45.323049],
	proximity: {
		longitude: -63.331663,
		latitude: 44.781492
	}
}); 

map.addControl(geocoder);

map.on('load', function() {
	
	map.addLayer({
		'id': 'halifax-db',
		'type': 'fill',
		'source': {
			'type': 'geojson',
			'data': 'Halifax_DB.geojson'
		},
		'layout': {
			'visibility': 'visible'
		},
		'paint': {
			'fill-color': '#444444',
			'fill-outline-color': '#444444'
		}
	});

	map.addLayer({
		'id': 'halifax-da',
		'type': 'fill',
		'source': {
				'type': 'geojson',
				'data': 'Halifax_DA.geojson'
		},
		'layout': {
				'visibility': 'visible'
		},
		'paint': {
				'fill-color': '#af2831',
				'fill-outline-color': '#af2831'
		}
	});

	map.addLayer({
		'id': 'halifax-odb',
		'type': 'fill',
		'source': {
				'type': 'geojson',
				'data': 'Halifax_ODB.geojson'
		},
		'layout': {
				'visibility': 'visible'
		},
		'paint': {
				'fill-color': '#f2f7e3',
				'fill-outline-color': '#f2f7e3'
		}
	});

	map.addSource('single-point', {
		type: 'geojson',
		data: {
			type: 'FeatureCollection',
			features: []
		}
	});
	
	map.addLayer({
		id: 'point',
		source: 'single-point',
		type: 'circle',
		paint: {
			'circle-radius': 5,
			'circle-color': '#448ee4'
		}
	});
	
	geocoder.on('result', function(e) {
		map.getSource('single-point').setData(e.result.geometry);
	});

});

// Popup on clicking building footprints
/* map.on('click', function(e) {
  var features = map.queryRenderedFeatures(e.point, {
    layers: ['odb-v2-newbrunswick-2d4dkm'] // replace this with the name of the layer
  });
  if (!features.length) {
    return;
  }
  var feature = features[0];
  var popup = new mapboxgl.Popup({ offset: [0, 0] })
    .setLngLat(turf.centerOfMass(feature.geometry).geometry.coordinates)
    .setHTML('<p>Area (m2) ' + Math.round(turf.area(feature.geometry)) + '</p>')
    .addTo(map);
}); */
map.on('click', 'halifax-odb', function (e) {
	new mapboxgl.Popup()
		.setLngLat(e.lngLat)
		.setHTML(e.features[0].properties.OBJECTID)
		.addTo(map);
});

// Change cursor to a pointer when the mouse is over the building footprints
map.on('mouseenter', 'halifax-odb', function () {
	map.getCanvas().style.cursor = 'pointer';
});

// Change it back when it leaves
map.on('mouseleave', 'halifax-odb', function() {
	map.getCanvas().style.cursor = '';
});

//Change the color for specified layers from a list
var swatches = document.getElementById('swatches');
var layer = document.getElementById('layer');
var colors = [
		'#d7191c',
    '#fdae61',
    '#ffffbf',
    '#abd9e9',
    '#2c7bb6',
    '#7b3294',
    '#c2a5cf',
    '#f7f7f7',
    '#a6dba0',
    '#008837'
];

colors.forEach(function(color) {
	var swatch = document.createElement('button');
	swatch.style.backgroundColor = color;
	swatch.addEventListener('click', function() {
		map.setPaintProperty(layer.value, 'fill-color', color);
	});
	swatches.appendChild(swatch);
});

// Add navigational controls to the map
map.addControl(new mapboxgl.NavigationControl());

// Toggle between different basemap styles
var layerList = document.getElementById('menu');
var inputs = layerList.getElementsByTagName('input');

function switchLayer(layer) {
	var layerId = layer.target.id;
	map.setStyle('mapbox://styles/mapbox/' + layerId);
}

for (var i = 0; i < inputs.length; i++) {
	inputs[i].onclick = switchLayer;
}

// Toggle data layers on and off
var toggleableLayerIds = ['halifax-db','halifax-da','halifax-odb'];

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