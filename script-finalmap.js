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
// zoom to previous extent
document.getElementById('fit-forward').addEventListener('click', function() {
	fit(arr[arr.length - 2]);
	zoomindex -= 1;
	arr.pop();
});
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
	zoomindex = 0;
	var arr = [[-64.278313,44.379177, -62.106446,45.334063]];
});
// makes the previous layer selectable again
document.getElementById('fit-previous').addEventListener('click', function() {
	zoomindex -= 1;
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
				'data': 'https://35.182.237.194:443/geoserver/openstatstest/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=openstatstest:diss_area&outputFormat=application/json'
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
			'data': 'https://35.182.237.194:443/geoserver/openstatstest/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=openstatstest:diss_block&outputFormat=application/json'
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
				'data': 'https://35.182.237.194:443/geoserver/openstatstest/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=openstatstest:study_area&outputFormat=application/json'
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

var selectID;

// creates the extent for on click zoom to feature
function fit(bbox) {
	map.fitBounds(bbox, {padding: 30});
}

function highlightFromChart(hovId) {
    var highFeatures = map.querySourceFeatures (zoomlevels[zoomindex], {
    sourceLayer: zoomlevels[zoomindex]
    })  ;
//highFeatures is a layer with all of the features in the current zoom level
    if (typeof map.getLayer('chartFeature') !== "undefined" ){         
        map.removeLayer('chartFeature')
        map.removeSource('chartFeature');   
    }
    var k; //empty variable to hold index for loop
    for (k in highFeatures) { //iterate through selected features
        if (highFeatures[k].properties.build_id == hovId) {
        {var highFeat = highFeatures[k];}        
         map.addSource('chartFeature', {
        "type":"geojson",
        "data": highFeat.toJSON()
    });
    map.addLayer({ //add the selected feature to the map as an additional layer with line styling to highlight it
        "id": "chartFeature",
        "type": "line",
        "source": "chartFeature",
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": { //styling of selection
            "line-color": "red",
            "line-width": 5
        }
    });
  }     } 
}


//https://gist.github.com/arirusso/3744782/d51bbd7e6efe9696b2032c056f80f22c84218d52
function loadchart(indata) {
var h = Math.max.apply(null, indata);
var w = 390 / indata.length;
var yfactor = 300 / h;
    h = h*yfactor; // sets maxheight to 300px and all other values will show proportionally
    
var chdata = [];
var ch;
    for (ch in indata) {
        chdata.push([idsArr[ch], indata[ch]])
    }
var chart = d3.select(".charts").append("svg")
  .attr("class", "chart")
  .attr("width", w * indata.length)
  .attr("height", h);

var x = d3.scale.linear()
  .domain([0, 1])
  .range([0, w]);

var y = d3.scale.linear() //newer version of d3 than example
  .domain([0, h])
  .rangeRound([0, h]); //rangeRound is used for antialiasing

var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

// x and y are the lower-left position of the bar
// width is the width of the bar
// height is the height of the bar
// for crisp edges use -.5 (antialiasing)
chart.selectAll("rect")
  .data(chdata)
  .enter().append("rect")
  .attr('class', 'bar')
  .attr('title', function(d) {return d;})
  .attr("fill", function(d) {
        if (d[0] == selectID) {return "yellow";}
    else {return "steelblue";};
                            }) //colour of bars
  .attr("x", function(d, i) { return x(i) - .5; })
  .attr("y", function(d) { return h - y(d[1]*yfactor) - .5; })
  .attr("width", w)
  .attr("height", function(d) { return y(d[1]*yfactor); } )
    .on("mouseover", function(d) {		
            div.transition()				
                .style("opacity", .9);		
            div	.html("Building ID: " + d[0] + "  Area: " + d[1])	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");
        highlightFromChart(d[0]);
            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .style("opacity", 0);
            map.removeLayer('chartFeature')
        map.removeSource('chartFeature');
        });
}
 //   https://github.com/turf-junkyard/turf-filter

var areaArr = [];
var proxArr = [];
var idsArr = [];

function filterByFk(ClArray) { //for odb only
document.getElementById("comptitle").innerHTML = "<h4>Comparison to Other Buildings in this Dissemination Block</h4>";
  //  document.getElementById("charts").innerHTML = "";
    //empty lists to hold chart data, reset each time the function is called
 areaArr = [];
 proxArr = [];
 idsArr = [];
//create an array of the features in the current zoom levels    
var compFeatures = map.querySourceFeatures (zoomlevels[zoomindex], {
    sourceLayer: zoomlevels[zoomindex]
    })  ;

    var t; //empty variable to hold index for loop
    for (t in compFeatures) { //iterate through selected features
        if (compFeatures[t].properties.dbuid == fkid) 
        { // for all of the features with the right fkid, add data to appropriate lists for charting (above)
            if (idsArr.includes(compFeatures[t].properties.build_id)) {continue;} //to avoid duplicates
            else {       areaArr.push((compFeatures[t].properties.shape_area).toFixed(2));
            proxArr.push(compFeatures[t].properties.near_dist);
            idsArr.push(compFeatures[t].properties.build_id);
        } //end second if
        } //end first if
    } //end for
   // i want it to call the loadchart function with the array of the row clicked as the parameter?
//return  ;
    if (ClArray == "area") {
        loadchart(areaArr, idsArr);
    }
    else if (ClArray == "prox") {
        loadchart(proxArr, idsArr);
    }
} //end filter function


//https://gis.stackexchange.com/questions/186533/highlight-feature-with-click-in-mapbox-gl
//variable to hold current zoom level features, currently hard-coded
//function selects and highlights a single feature in the current zoom level
//array holds a list of all of the available layers for zooming
var zoomlevels = ['Dissemination Area','Dissemination Block','Building Footprints']; //this may be a repeat of toggleablelayers list below...
//set the index to the default zoom level/active layer. This layer will be selectable.
var zoomindex = 0;

	var arr = [[-64.278313,44.379177, -62.106446,45.334063]];

var fkid;
var pkfield;

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
        selectID = feature.properties.build_id;
        fkid = feature.properties.dbuid; //needs to be changed to the dbid and also this needs to be duplicated for each of these else if blocks so that there is a fkid developed for each layer
        pkfield = "dbuid";
//!! IDEA: can we put the instructions for the different buttons in sort of like a gallery on the home page to break up how the user should interact with it to break up the block of text.. text needs to be edited for accuracy, currency and logic.
        
    //Build summary statistics table for footprint-level selection
    document.getElementById('sumstats').innerHTML = '<div><table><tr><th><h4>Summary of Statistics and Data</h4></th></tr><tr><th>Building ID Number</th><td id="IDno"></td></tr><tr class="highlight" onclick="filterByFk(&#39;area&#39;)"><th>Building Footprint Area</th><td id="area"></td></tr><tr><th>Building Name</th><td id="name"></td></tr><tr class="highlight" onclick="filterByFk(&#39;year&#39;)"><th>Year of Construction</th><td id="y_const"></td></tr><tr><th>Address</th><td id="address"></td></tr><tr class="highlight" onclick="filterByFk(&#39;prox&#39;)"><th>Proximity to closest building</th><td id="proximity"></td></tr></table><div id="compstats"><div id="comptitle"></div><div class="charts"></div></div></div>';

} else if ([zoomlevels[zoomindex]] == 'Dissemination Block') {
    fkid = feature.properties.DAUID;
//In the future would be good to add functionality that allowed the user to compare two areas by using the two most recent selections - pop up of selection id would be needed in the application and cancellation of selection by clicking an x in the corner for clicking around the map, possibly at a national level.
    document.getElementById('sumstats').innerHTML = '<div><table><tr><th>Summary of Statistics and Data (dissblock)</th></tr><tr><th>Dissemination Block ID</th><td id="IDno" class="selectindicator"></td></tr><tr><th>Number of buildings contained</th><td id="numofb_contained"></td></tr><tr><th>Average building footprint area</th><td id="area"></td></tr><tr><th>Average building proximity to next building</th><td id="proximity"></td></tr></table><br/><canvas id="compstats" class="chart"></canvas></div>';} 
    else if ([zoomlevels[zoomindex]] == 'Dissemination Area') {
        fkid = feature.properties.CSDUID;
document.getElementById('sumstats').innerHTML = '<div><table><tr><th>Summary of Statistics and Data (dissarea)</th></tr><tr><th>Dissemination Area ID</th><td id="IDno"></td></tr><tr><th>Number of buildings contained</th><td id="numofb_contained"></td></tr><tr><th>Average building footprint area</th><td id="area"></td></tr><tr><th>Average building proximity to next building</th><td id="proximity"></td></tr></table><br/><canvas id="compstats" class="chart" onload="loadchart()"></canvas></div>';};

    
    //fill the summary statistics box with data based on which layer is the active layer and by referencing attributes in the geojson object selected
    if ([zoomlevels[zoomindex]] == 'Building Footprints') {
    document.getElementById('IDno').innerHTML = feature.properties.build_id; //fills the html div with content
    //MUST BE AFTER the var feature declaration
    document.getElementById('area').innerHTML = feature.properties.shape_area;
        document.getElementById('proximity').innerHTML = feature.properties.near_dist;
        document.getElementById('address').innerHTML = 'No Data available'; //feature.properties.address;
        document.getElementById('name').innerHTML = 'No Data available'; //feature.properties.build_name;
        document.getElementById('y_const').innerHTML = 'No Data available'; //feature.properties.year_constr; //need to change these variables to match feature property names and add additional HTML elements to contain the additional statistics computed
    //document.getElementById('fk').innerHTML = fkid; //check geojson file for the attributes 
}
    else if ([zoomlevels[zoomindex]] == 'Dissemination Area') {
        document.getElementById('IDno').innerHTML = feature.properties.DAUID;
      //  document.getElementById('avgarea').innerHTML = ;
        
    }
    
        else if ([zoomlevels[zoomindex]] == 'Dissemination Block') {
        document.getElementById('IDno').innerHTML = feature.properties.DBUID;
      //  document.getElementById('avgarea').innerHTML = ;
        //         document.getElementById('fk').innerHTML = feature.properties.DAUID;   
        
    }
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
     //   geomup = turf.feature(feature);
    var bbox = turf.extent(feature); //sets extent to extent of the feature, but not to the odb
  fit(bbox);
            zoomindex += 1;
    arr.push(bbox);
      //  geomup = turf.feature(feature);
    }//changes selectable layer to next smallest geography upon selection (not for odb selection)
    
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

var layerlabels = ['DA', 'DB', 'ODB', 'BAI'];
for (var i=0; i<toggleableLayerIds.length;i++) {
	var id = toggleableLayerIds[i];

	var link = document.createElement('a');
	link.href = '#';
	link.className = 'active';
	link.textContent = id;
	link.setAttribute("id", id);
	link.setAttribute("data-original-title", layerlabels[i]);
	link.setAttribute("data-toggle", "tooltip");
	link.setAttribute("data-placement", "right");

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