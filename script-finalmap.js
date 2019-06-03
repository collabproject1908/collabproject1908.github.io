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
    style: 'mapbox://styles/collabproject1908/cjwdxm7ft1agp1cl0euo5td3z', // stylesheet location
    center: [-71.782168,45.684759],
    zoom: 5
});

//bounds for the zoom defaults
//to guelph
document.getElementById('fit-Guelph').addEventListener('click', function() {
	map.fitBounds([
		[-80.374954,43.460342],
		[-80.128757,43.611639]
	]);
});
// to halifax 
document.getElementById('fit-Halifax').addEventListener('click', function() {
	map.fitBounds([
		[-64.278313,44.379177],
		[-62.106446,45.334063]
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
		'id': 'Dissemination Area',  //dissemination area
		'type': 'fill',
		'source': {
				'type': 'geojson',
				'data': 'Halifax_DA.geojson'
		},
		'layout': {
				'visibility': 'visible'
		},
		'paint': {
				'fill-color': 'rgba(226,208,86,0)',
				'fill-outline-color': '#e2d056'
		}
	});

	map.addLayer({
		'id': 'Dissemination Block',  //dissemination block
		'type': 'fill',
		'source': {
			'type': 'geojson',
			'data': 'Halifax_DB.geojson'
		},
		'layout': {
			'visibility': 'visible'
		},
		'paint': {
			'fill-color': 'rgba(35,141,170,0)',
			'fill-outline-color': '#238daa'
		}
	});

	map.addLayer({  //adding max and min zoom levels
		'id': 'Building Footprints',   //buildings
		'type': 'fill',
		'source': {
				'type': 'geojson',
				'data': 'Halifax_ODB.geojson'
		},
		'layout': {
				'visibility': 'visible'
		},
		'paint': {
				'fill-color': '#65b7bf'
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
			'circle-color': '#e44a44'
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
//function selects and highlights a single feature in the current zoom level
//array holds a list of all of the available layers for zooming
var zoomlevels = ['Dissemination Area','Dissemination Block','Building Footprints']; //this may be a repeat of toggleablelayers list below...
//set the index to the default zoom level/active layer. This layer will be selectable.
var zoomindex = 0;


map.on('click', function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: [zoomlevels[zoomindex]] });

    if (!features.length) {
        return;
    }
    if (typeof map.getLayer('selectedFeature') !== "undefined" ){         
        map.removeLayer('selectedFeature')
        map.removeSource('selectedFeature');   
    }
    var feature = features[0];
    //builds structure for the summary statistics box based on which layer is the active layer
    if ([zoomlevels[zoomindex]] == 'Building Footprints') {    
    document.getElementById('sumstats').innerHTML = '<div><h3>Summary of Statistics and Data</h3></div><div><h4>Building ID Number</h4></div><div><p id="IDno"></p></div><div><h4>Building Area</h4></div><div><p><span id="area"></span><span> m<sup>2</sup></span></p></div>';
} else if ([zoomlevels[zoomindex]] == 'Dissemination Block') {
    document.getElementById('sumstats').innerHTML = '<div><h3>Summary of Statistics and Data</h3></div><div><h4>Dissemination Block ID</h4></div><div><p id="IDno"></p></div><div><h4>Building Count</h4></div><div><p id="count"></p></div>';} 
    else if ([zoomlevels[zoomindex]] == 'Dissemination Area') {
document.getElementById('sumstats').innerHTML = '<div><h3>Summary of Statistics and Data</h3></div><div><h4>Dissemination Area ID</h4></div><div><p id="IDno"></p></div><div><h4>Building Count</h4></div><div><p id="count"></p></div><div><h4>Average Building Area</h4></div><div id="avgarea"></div>';};
    //fill the summary statistics box with data based on which layer is the active layer and by referencing attributes in the geojson object selected
    if ([zoomlevels[zoomindex]] == 'Building Footprints') {
    document.getElementById('IDno').innerHTML = feature.properties.Build_ID; //fills the html div with content
    //MUST BE AFTER the var feature declaration
    document.getElementById('area').innerHTML = feature.properties.Shape_Area;} //check geojson file for the attributes available
    else if ([zoomlevels[zoomindex]] == 'Dissemination Area') {
        document.getElementById('IDno').innerHTML = feature.properties.DAUID;
        
    }

    console.log(feature.toJSON()); // not sure what this line does 
    map.addSource('selectedFeature', {
        "type":"geojson",
        "data": feature.toJSON()
    });
    map.addLayer({ //add the selected feature to the map as an additional layer with line styling to highlight it
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

    if (zoomindex < 2) { //change the value to the index of the odb data in the list
    var bbox = turf.extent(feature); //sets extent to extent of the feature, but not to the
  fit(bbox);
        zoomindex += 1;}//changes selectable layer to next smallest geography upon selection (not for odb selection)

});

// Change cursor to a pointer when the mouse is over the building footprints on hover
map.on('mouseenter', 'Building Footprints', function () {
	map.getCanvas().style.cursor = 'pointer';
});

// Change cursor back when it leaves hover
map.on('mouseleave', 'Building Footprints', function() {
	map.getCanvas().style.cursor = '';
});

// Add navigational controls to the map
map.addControl(new mapboxgl.NavigationControl());

// Toggle data layers on and off
var toggleableLayerIds = ['Dissemination Area','Dissemination Block','Building Footprints'];  //links to addLayer above

for (var i=0; i<toggleableLayerIds.length;i++) {
	var id = toggleableLayerIds[i];

	var link = document.createElement('a');
	link.href = '#';
	link.className = 'active';
	link.textContent = id;
	
	// var a_id1 = document.getElementsByTagName('a')[0];
	// var id1 = document.createAttribute('id');
	// id1.value = 'darea';
	// a_id1.setAttributeNodeNS(id1);

	// var a_id2 = document.getElementsByTagName('a')[1];
	// var id2 = document.createAttribute('id');
	// id2.value = 'dblock';
	// a_id2.setAttributeNodeNS(id2);

	// var a_id3 = document.getElementsByTagName('a')[2];
	// var id3 = document.createAttribute('id');
	// id3.value = 'bfp';
	// a_id3.setAttributeNodeNS(id3);

	// var darea = document.getElementById('darea');
	// var darea_att1 = document.createAttribute('data-toggle');
	// darea_att1.value = 'tooltip';
	// darea.setAttributeNodeNS(darea_att1);
	// var darea_att2 = document.createAttribute('data-placement');
	// darea_att2.value = 'right';
	// darea.setAttributeNodeNS(darea_att2);
	// var darea_att3 = document.createAttribute('title');
	// darea_att3.value = 'Horray!';
	// darea.setAttributeNodeNS(darea_att3);

	// var dblock = document.getElementById('dblock');
	// var dblock_att1 = document.createAttribute('data-toggle');
	// dblock_att1.value = 'tooltip';
	// dblock.setAttributeNodeNS(dblock_att1);
	// var dblock_att2 = document.createAttribute('data-placement');
	// dblock_att2.value = 'right';
	// dblock.setAttributeNodeNS(dblock_att2);
	// var dblock_att3 = document.createAttribute('title');
	// dblock_att3.value = 'Horray!';
	// dblock.setAttributeNodeNS(dblock_att3);
	
	// var bfp = document.getElementById('bfp');
	// var bfp_att1 = document.createAttribute('data-toggle');
	// bfp_att1.value = 'tooltip';
	// bfp.setAttributeNodeNS(bfp_att1);
	// var bfp_att2 = document.createAttribute('data-placement');
	// bfp_att2.value = 'right';
	// bfp.setAttributeNodeNS(bfp_att2);
	// var bfp_att3 = document.createAttribute('title');
	// bfp_att3.value = 'Horray!';
	// bfp.setAttributeNodeNS(bfp_att3);

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

$(document).ready(function(){
	$('[data-toggle="tooltip"]').tooltip();
});