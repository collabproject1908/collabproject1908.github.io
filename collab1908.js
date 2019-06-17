// Click anywhere on the overlay to turn it off - this turns it off permanently/until the entire page is reloaded/refreshed
function off() {
	document.getElementById("overlay").style.display = "none";
}

// Event listener FOR CHOROPLETH - URGENT
//document.getElementById("indicator").addEventListener("change", paint, false);


// Use Mapbox JS API to create a map canvas and fill it with the application described below.
mapboxgl.accessToken = 'pk.eyJ1IjoiY29sbGFicHJvamVjdDE5MDgiLCJhIjoiY2p0ZWdwMjl1MWhsYzQ5bzlvdzBmOW13OCJ9.e9FtSFxY-nswnnCgtFXonA';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/collabproject1908/cjwdxm7ft1agp1cl0euo5td3z', // Custom basemap style
    center: [-71.782168,45.684759], // Default center location of map extent
    zoom: 5, // Default zoom level of map extent
    attributionControl: false
});

map.addControl(new mapboxgl.AttributionControl({
    customAttribution: "Data from Statistics Canada Open Database of Buildings, 2019 and Statistics Canada Boundary Files, 2018"
}));

// Array to hold previous extents 
var arr = [];

// Bar of buttons at top give recommended areas to explore and control over the selection functionality.
// ----
// This button both returns to the most recent extent based on click history.
// It also returns the selection layer back one layer. This should be the appropriate layer.
// Reload a default if unexpected behaviour occurs.
document.getElementById('fit-previous').addEventListener('click', function() {
	if (arr.length == 0) {console.log('No previous extent to load.')}
    else {    
        fit(arr[arr.length - 2]);
        zoomindex -= 1;
        arr.pop();
    }
});

// Recommended area: Guelph, Ontario
// Zoom to this region/reset default zoom settings for this region
document.getElementById('fit-Guelph').addEventListener('click', function() {
	map.fitBounds([
		[-80.272013, 43.530338], 
		[-80.215308, 43.556968] 
	]);
    zoomindex = 0;
	arr = [[-80.272013, 43.530338], 
		[-80.215308, 43.556968]];
    if (typeof map.getLayer('selectedFeature') !== "undefined" ){         
        map.removeLayer('selectedFeature')
        map.removeSource('selectedFeature');   
    }
});

// Recommended area: Fredericton, New Brunswick
// Zoom to this region/reset default zoom settings for this region
document.getElementById('fit-Fredericton').addEventListener('click', function() {
	map.fitBounds([
		[-66.676185, 45.952120], 
		[-66.609921, 45.983056] 
	]);
    zoomindex = 0;
	arr = [[-66.676185, 45.952120], 
		[-66.609921, 45.983056]];
    if (typeof map.getLayer('selectedFeature') !== "undefined" ){         
        map.removeLayer('selectedFeature')
        map.removeSource('selectedFeature');   
    }
});

// Recommended area: Halifax, Nova Scotia
// Zoom to this region/reset default zoom settings for this region
document.getElementById('fit-Halifax').addEventListener('click', function() {
	map.fitBounds([
		[-63.647926, 44.641998], 
		[-63.531185, 44.698222] 
	]);
	zoomindex = 0;
	arr = [[-63.647926, 44.641998], 
		[-63.531185, 44.698222]];
    if (typeof map.getLayer('selectedFeature') !== "undefined" ){         
        map.removeLayer('selectedFeature')
        map.removeSource('selectedFeature');   
    }
});

// Use this button with caution:
// This button moves the selectable layer back one time per click.
// Pressing the button twice moves the selectable layer back two layers.
// Reload a default if unexpected behaviour occurs.
document.getElementById('select-bldg').addEventListener('click', function() {
	zoomindex = 2;
});

// Initializes the geocoder functionality
var geocoder = new MapboxGeocoder({
	accessToken: mapboxgl.accessToken,
	placeholder: 'Search',
	bbox: [-80.331762, 43.465752, -61.458362, 47.101916]
	/* proximity: { // shows only the nearest location with that address to this coordinate
		longitude: -63.331663,
		latitude: 44.781492
	} */
}); 

// Creates the control/search bar for the geocoder
map.addControl(geocoder); 

var clickedLayer = "Building Footprints";


// Add data from the database into the application
// The 'id' property indicates which layer is being added
// To add an updated link, write the correct link beside the 'data' property
// To update the outline colours of the layers, update the 'paint' 'fill-outline-color' property
map.on('load', function() { 
  /*  map.addSource("footprint", {
		"type": "geojson",
		"data": "https://35.182.237.194:443/geoserver/openstatstest/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=openstatstest:footprint&outputFormat=application/json"
	});
*/

    map.addLayer({  // Minimum and maximum zoom levels need to be set for each of these layers
        'id': 'Dissemination Area', 
        'type': 'fill',
        'source': {
                'type': 'geojson',
                'data': 'https://35.182.237.194:443/geoserver/openstatstest/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=openstatstest:dissarea&outputFormat=application/json'
        },
        'layout': {
                'visibility': 'visible'
        },
        'paint': {
                'fill-color': 'rgba(226,208,86,0)',
                'fill-outline-color': '#025b05'
        }
    });

	map.addLayer({
		'id': 'Dissemination Block', 
		'type': 'fill',
		'source': {
			'type': 'geojson',
			'data': 'https://35.182.237.194:443/geoserver/openstatstest/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=openstatstest:dissblock&outputFormat=application/json'
		},
		'layout': {
			'visibility': 'visible'
		},
		'paint': {
			'fill-color': 'rgba(35,141,170,0)',
			'fill-outline-color': '#59e05e'
		}
	});
    
	/* map.addLayer({  // Minimum and maximum zoom levels need to be set for each of these layers
		'id': 'Dissemination Area', 
		'type': 'fill',
		'source': {
				'type': 'geojson',
				'data': 'https://35.182.237.194:443/geoserver/openstatstest/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=openstatstest:dissarea&outputFormat=application/json'
		},
		'layout': {
				'visibility': 'visible'
		},
		'paint': {
				'fill-color': 'rgba(226,208,86,0)',
				'fill-outline-color': '#025b05'
		}
	}); */
    
    map.addLayer({
		"id": "Building Footprints",
		"interactive": true,
		"type": "fill",
		"source": {
				'type': 'geojson',
				'data': "https://35.182.237.194:443/geoserver/openstatstest/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=openstatstest:footprint&outputFormat=application/json"
		}
        ,
		"layout": {
			"visibility": "visible"
		},
		"paint": {
			"fill-color": "#fe9929",
        }
	});
    
    map.addLayer({
		"id": "Building Area",
		"source": "Building Footprints",
		"type": "fill",
		"layout": {"visibility": "none"},
		"paint": {
			"fill-color": [
				"interpolate",
				["linear"],
				["get", "shape_area"],
				0, "#ffffd4",
				50, "#fed98e",
				125, "#fe9929",
				300, "#d95f0e",
				1500, "#d95f0e"
			],
			"fill-opacity": 0.75
		}
	});
    
    map.addLayer({
		"id": "Proximity to Building",
		"source": "Building Footprints",
		"type": "fill",
		"layout": {"visibility": "none"},
		"paint": {
			"fill-color": [
				"interpolate",
				["linear"],
				["get", "prox_bldg"],
				0, "#ffffd4",
				1, "#fed98e",
				10, "#fe9929",
				30, "#d95f0e",
				100, "#d95f0e"
			],
			"fill-opacity": 0.75
		}
	});
    
    map.addLayer({
		"id": "Proximity to Road",
		"source": "Building Footprints",
		"type": "fill",
		"layout": {"visibility": "none"},
		"paint": {
			"fill-color": [
				"interpolate",
				["linear"],
				["get", "prox_rd"],
				0, "#ffffd4",
				5, "#fed98e",
				20, "#fe9929",
				100, "#d95f0e",
				1000, "#d95f0e"
			],
			"fill-opacity": 0.75
		}
	});
    
    map.addLayer({
		"id": "Proximity to Water",
		"source": "Building Footprints",
		"type": "fill",
		"layout": {"visibility": "none"},
		"paint": {
			"fill-color": [
				"interpolate",
				["linear"],
				["get", "prox_wat"],
				0, "#ffffd4",
				300, "#fed98e",
				650, "#fe9929",
				1250, "#d95f0e",
				3000, "#d95f0e"
			],
			"fill-opacity": 0.75
		}
	});
    
    // Here an empty geojson object is created to store the point for the geolocator
	map.addSource('single-point', {
		type: 'geojson',
		data: {
			type: 'FeatureCollection',
			features: []
		}
	});
	
    // The point from the geocoder is added and styled.
	map.addLayer({  
		id: 'point',
		source: 'single-point',
		type: 'circle',
		paint: {
			'circle-radius': 5,
			'circle-color': '#e44a44'
		}
	});
	
    // This populates the dropdown in the search bar and sends coordinates to the empty geojson object
	geocoder.on('result', function(e) {  
		map.getSource('single-point').setData(e.result.geometry);
	});

});

// Toggle area - indicator

//List of legends
var toggleableLayerIds = [ 'Building Area', 'Proximity to Water', 'Proximity to Building', 'Proximity to Road' ];
    
//Variables for each legend
var areaLegend = document.getElementById('area-legend');
var pxRdLegend = document.getElementById('rd-legend');
var pxWatLegend = document.getElementById('wat-legend');
var pxBldgLegend = document.getElementById('bldg-legend');

for (var i = 0; i < toggleableLayerIds.length; i++) {
	var id = toggleableLayerIds[i];
	 
	var link = document.createElement('b');
	link.href = '#';
	link.className = 'active';
	link.textContent = id;
	 
	link.onclick = function (e) {
		clickedLayer = this.textContent;
		e.preventDefault();
		e.stopPropagation();
		 
		var visibility = map.getLayoutProperty(clickedLayer, 'visibility');
		 
		if (visibility === 'visible') {
			map.setLayoutProperty(clickedLayer, 'visibility', 'none');
			this.className = '';
			if (clickedLayer === 'Building Area') {
				areaLegend.style.display = 'none';
			} else if (clickedLayer === 'Proximity to Building') {
				pxBldgLegend.style.display = 'none';
			} else if (clickedLayer === 'Proximity to Road') {
				pxRdLegend.style.display = 'none';
            } else if (clickedLayer === 'Proximity to Water') {
				pxWatLegend.style.display = 'none';
            }
		} else {
			this.className = 'active';
			map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
			if (clickedLayer === 'Building Area') {
                areaLegend.style.display = 'block';
                pxBldgLegend.style.display = 'none';
                pxRdLegend.style.display = 'none';
                pxWatLegend.style.display = 'none';
			} else if (clickedLayer === 'Proximity to Building') {
                areaLegend.style.display = 'none';
                pxBldgLegend.style.display = 'block';
                pxRdLegend.style.display = 'none';
                pxWatLegend.style.display = 'none';
			} else if (clickedLayer === 'Proximity to Road') {
                areaLegend.style.display = 'none';
                pxBldgLegend.style.display = 'none';
                pxRdLegend.style.display = 'block';
                pxWatLegend.style.display = 'none';
            } else if (clickedLayer === 'Proximity to Water') {
                areaLegend.style.display = 'none';
                pxBldgLegend.style.display = 'none';
                pxRdLegend.style.display = 'none';
                pxWatLegend.style.display = 'block';
            }
		}
	};
	 
	var layers = document.getElementById('toggle');
	layers.appendChild(link);
}

// This function takes as the input a bounding box and zooms the map to that extent, with a buffer around the edge
function fit(bbox) {
	map.fitBounds(bbox, {padding: 30});
}

// Only works for ODB dataset currently
// This function takes as the input the building ID that corresponds to the bar on the chart that is currently experiencing a mouseover event
function highlightFromChart(hovId) {
    // Variable highFeatures creates a json object of all features in the ODB layer within the viewport
    var highFeatures = map.querySourceFeatures ("Building Footprints", {
    sourceLayer: "Building Footprints"
    });
    
    // Removes the highlighting if any is there - there shouldn't be as it is also removed when mouseover stops
    if (typeof map.getLayer('chartFeature') !== "undefined" ){         
        map.removeLayer('chartFeature')
        map.removeSource('chartFeature');   
    }
    
    var k; // Empty variable to hold index for loop
    
    //Iterates through the queried features and selects the feature with the same ID that is passed into the function
    for (k in highFeatures) {
        if (highFeatures[k].properties.build_id == hovId) {
            {var highFeat = highFeatures[k];}
            
            // Creates a json object to hold the selection
            map.addSource('chartFeature', {
                "type":"geojson",
                "data": highFeat.toJSON()
            });
            
            //Adds the selected feature to the map in its own layer
            map.addLayer({
                "id": "chartFeature",
                "type": "line",
                "source": "chartFeature",
                "layout": {
                    "line-join": "round",
                    "line-cap": "round"
                },
                "paint": { //Styling of highlight from chart selection
                    "line-color": "red",
                    "line-width": 5
                }
            });
        }
    }  
}

// Arrays to store data values, need to be declared outside of the function as they are global and used in other functions
// If new data is added, this may need to be updated. Note only data that is a candidate for comparative statistics need to be loaded into arrays.
var ids = [];
var bldg_area = [];
var bldg_count = [];
var prox_rd = [];
var prox_wat = [];
var prox_bldg = [];
var num_ch = [];
var num_ad = [];
var num_snr = [];
var perc_cov = [];

// The following resource was used to assist with the creation of the D3 chart:
// https://gist.github.com/arirusso/3744782/d51bbd7e6efe9696b2032c056f80f22c84218d52
// This function creates the chart. It takes as its input the array which holds the data for the measure selected
// Important to note that version 3 of D3 was used for compatibility with the tooltip
function loadchart(indata, tiptitle) {
    // Variable determines the highest value in the selected field
    var h = Math.max.apply(null, indata);
    // Variable sets the width of each bar in the chart by setting the width of the whole chart to 390 and giving each bar an equal share of that space
    var w = 390 / indata.length;
    // Variable determines what percentage of the maximum height of 300 is occupied by the maximum value of the input array
    var yfactor = 300 / h;
    // Recalculate height of the chart based on the factor above
    h = h*yfactor;
    // Empty array will be populated with the values to use for the chart.
    var chdata = [];

    var ch; // Empty variable to hold index for loop
    // Iterates through the array, storing the ID and the measured value in the chart data array for each feature
    for (ch in indata) {
        chdata.push([ids[ch], indata[ch]])
    }
    // Initializes a D3 chart as an svg element
    var chart = d3.select(".charts").append("svg")
      .attr("class", "chart")
      .attr("width", w * indata.length)
      .attr("height", h);

    // Sets the x axis
    var x = d3.scale.linear()
      .domain([0, 1])
      .range([0, w]);

    // Sets the y axis
    var y = d3.scale.linear()
      .domain([0, h])
      .rangeRound([0, h]);

    // Creates a tooltip for each bar of the chart
    var div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);

    // Creates each bar of the chart using the array of arrays
    chart.selectAll("rect")
      .data(chdata)
      .enter().append("rect")
      .attr('class', 'bar')
      .attr('title', function(d) {return d;}) // Returns the values from chdata into the tooltip text
      .attr("fill", function(d) { // Sets the bar for the current selection to yellow and all other bars to blue
            if (d[0] == selectID) 
                {return "yellow";}
            else 
                {return "steelblue";};})
      .attr("x", function(d, i) { return x(i) - .5; })
      .attr("y", function(d) { return h - y(d[1]*yfactor) - .5; }) 
      .attr("width", w)
      .attr("height", function(d) { return y(d[1]*yfactor); } ) // Important to multiply by the yfactor as this gives an updated height for the bar
      .on("mouseover", function(d) { // Tooltip displaying data values for currently selected measure on hovering over the bars		
            div.transition()				
                .style("opacity", .9);		
            div	.html("<p>Building ID: " + d[0] + "</p><p>" + tiptitle +": " + d[1] + "</p>") // AJAX HTML	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");
            highlightFromChart(d[0]); // Sends the ID of the bar experiencing the mouseover event to the function which highlights the corresponding building on the map
            })						
    .on("mouseout", function(d) {		
            div.transition()		
                .style("opacity", 0);
            map.removeLayer('chartFeature') //Removes the highlighting from the map when the user stops hovering over the chart bar
            map.removeSource('chartFeature');
    });
}

// This function populates arrays of data related to buildings in the same dissemination block as the selected buildings, and sends them to the loadchart function where the chart is built.
function filterByFk(ClArray) { //for odb only
    // Set title for Comparative Statistics panel
    document.getElementById("comptitle").innerHTML = "<h4>Comparison to Other Buildings in this Dissemination Block</h4>";
    // Need to write functionality to empty old chart !!
    
    // Global arrays emptied. If new measures are added, this needs to be revised to include new indicators, as above
    ids = [];
    bldg_area = [];
    bldg_count = [];
    prox_rd = [];
    prox_wat = [];
    prox_bldg = [];
    num_ch = [];
    num_ad = [];
    num_snr = [];
    perc_cov = [];
    // Variable compFeatures creates a json object of all features in the ODB layer within the viewport
    var compFeatures = map.querySourceFeatures ("Building Footprints", {
        sourceLayer: "Building Footprints"
    }); 
    var t; // Empty variable to hold index for loop
    // Iterates through the queried features
    for (t in compFeatures) { 
        if (compFeatures[t].properties.dbuid == fkid) { // Only affects features that have the same foreign key as the selected feature
            if (ids.includes(compFeatures[t].properties.build_id)) {continue;} // Necessary to avoid duplicate features in the chart
            // Populates empty arrays with data
            else { // Update this else statement to push new measures to new arrays
                // A variety of data manipulations are possible at this point
                ids.push(compFeatures[t].properties.build_id);
        bldg_area.push(compFeatures[t].properties.shape_area.toFixed(2)); // Round to 2 places
                bldg_count.push(compFeatures[t].properties.bldg_count);
                prox_rd.push(compFeatures[t].properties.prox_rd.toFixed(1));
             prox_wat.push(compFeatures[t].properties.prox_wat.toFixed(1));
         prox_bldg.push(compFeatures[t].properties.prox_bldg.toFixed(1));
            }
        }
    }
    document.getElementById("emptycharts").innerHTML = "";
    // Loads chart with the appropriate data array
    if (ClArray == "area") {
        loadchart(bldg_area, "Area");
    } 
    else if (ClArray == "prox_bldg") {
        loadchart(prox_bldg, "Proximity to closest building");
    } 
    else if (ClArray == "prox_wat") {
        loadchart(prox_wat, "Proximity to closest water feature");
    } 
    else if (ClArray == "prox_rd") {
        loadchart(prox_rd, "Proximity to closest road");
    }
}

// All layers that are available for selection and for toggling
var zoomlevels = ['Dissemination Area','Dissemination Block','Building Footprints']; //this may be a repeat of toggleablelayers list below...

// Create zoom index and set to default. The layer indexed in the zoomlevels list is the selectable layer. Can be byppassed using the Begin Selecting Buildings button.
var zoomindex = 0;

// Empty variables to hold the primary key ID, foreign key ID and primary key field of a selected feature
var fkid;
var selectID;
var pkfield;

// The following resource was used to create the selection functionality and was modified for other functions in this script
//https://gis.stackexchange.com/questions/186533/highlight-feature-with-click-in-mapbox-gl
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
    
    // Table elements need to be styled, especially for width
    // AJAX build of summary statistics panel tables by layer
    if ([zoomlevels[zoomindex]] == 'Building Footprints') {    
        selectID = feature.properties.build_id;
        fkid = feature.properties.dbuid; //needs to be changed to the dbid and also this needs to be duplicated for each of these else if blocks so that there is a fkid developed for each layer
        pkfield = "dbuid";
        document.getElementById('sumstats').innerHTML = '<div><table><tr><th colspan="2"><h4>Summary of Statistics and Data</h4></th></tr><tr><th>Building ID</th><td id="idno"></td></tr><tr class="highlight" onclick="filterByFk(&#39;area&#39;)"><th>Building Footprint Surface Area</th><td><span id="area"></span><span> m<sup>2</sup></span></td></tr><tr class="highlight" onclick="filterByFk(&#39;prox_bldg&#39;)"><th>Proximity to closest building</th><td><span id="prox_bldg"></span> m</td></tr><tr class="highlight" onclick="filterByFk(&#39;prox_rd&#39;)"><th>Proximity to closest road</th><td><span id="prox_rd"></span> m</td></tr><tr><th>Name of closest road</th><td><span id="nam_rd"> </span><span id="typ_rd"></span></td></tr><tr class="highlight" onclick="filterByFk(&#39;prox_wat&#39;)"><th>Proximity to closest water feature</th><td><span id="prox_wat"></span> m</td></tr><tr><th>Name of closest water feature</th><td id="nam_wat"></td></tr><tr><th>Building Name</th><td id="nam_bldg"></td></tr><tr><th>Year of Construction</th><td id="yr_bldg"></td></tr><tr><th>Address</th><td><span id="st_num"> </span><span id="st_nam"> </span><span id="st_typ"></span></td></tr><!--*--></table><p>Note that 0 data may indicate "No Data Available".</p><div id="compstats"><div id="comptitle"></div><div id="emptycharts" class="charts"></div></div></div>';
    } else if ([zoomlevels[zoomindex]] == 'Dissemination Block') { 
        fkid = feature.properties.dauid;
        document.getElementById('sumstats').innerHTML = '<div><table><tr><th colspan="2"><h4>Summary of Statistics and Data</h4></th></tr><!--<tr><th>Dissemination Block ID</th><td id="idno"></td></tr>--><tr class="highlight" onclick="filterByFk(&#39;count&#39;)"><th>Number of Buildings Contained</th><td id="count"></td></tr><tr><th>Mean Building Footprint Surface Area</th><td><span id="area"></span><span> m<sup>2</sup></span></td></tr><tr><th>Mean Proximity to closest building</th><td><span id="prox_bldg"></span> m</td></tr><tr><th>Mean Proximity to closest road</th><td><span id="prox_rd"></span> m</td></tr><tr><th>Mean Proximity to closest water feature</th><td><span id="prox_wat"></span> m</td></tr><tr id="addrows"></tr><!--*--></table><p>Note that 0 data may indicate "No Data Available".</p></div>';
    } else if ([zoomlevels[zoomindex]] == 'Dissemination Area') {
        fkid = feature.properties.csduid;
        document.getElementById('sumstats').innerHTML = '<div><table><tr><th colspan="2"><h4>Summary of Statistics and Data</h4></th></tr><tr><th>Number of Buildings Contained</th><td id="count"></td></tr><tr><th>Mean Building Footprint Surface Area</th><td><span id="area"></span><span> m<sup>2</sup></span></td></tr><tr><th>Mean Proximity to closest building</th><td><span id="prox_bldg"></span> m</td></tr><tr><th>Mean Proximity to closest road</th><td><span id="prox_rd"></span> m</td></tr><tr><th>Mean Proximity to closest water feature</th><td><span id="prox_wat"></span> m</td></tr><tr><th>Mean number of children (0-14) per building</th><td id="num_ad"></td></tr><tr><th>Mean number of adults (15-64) per building</th><td id="num_ch"></td></tr><tr><th>Mean number of seniors (65+) per building</th><td id="num_snr"></td></tr><!--*--></table><p>Note that 0 data may indicate "No Data Available".</p></div>';
    };
    
    // This is where the table data elements are populated.
    //This needs to be automated for all fields if possible of the table...table rowlists can be in a list?
    // FOR NOW: To add a new property, ensure that the field is added to the database, link is refreshed, and new link is sourced in map.on('load'). Then, add .innerHTML statement here in javascript. Use this template for updating the HTML statement at the <!--*--> comment:
    // <tr class="highlight" onclick="filterByFk(&#39;FIELDNAME&#39;)"><th>LABEL</th><td id="FIELDNAME"></td></tr>
    // And use this JavaScript statement at the bottom of the list below in the appropriate field.
    //      document.getElementById('FIELDNAME').innerHTML = feature.properties.FIELDNAME;
    if ([zoomlevels[zoomindex]] == 'Building Footprints') {
        document.getElementById('idno').innerHTML = feature.properties.build_id;
        document.getElementById('area').innerHTML = (feature.properties.shape_area).toFixed(2);
        document.getElementById('prox_bldg').innerHTML = (feature.properties.prox_bldg).toFixed(1);
        document.getElementById('prox_rd').innerHTML = (feature.properties.prox_rd).toFixed(1);
        document.getElementById('nam_rd').innerHTML = feature.properties.nam_rd;
        document.getElementById('typ_rd').innerHTML = ' ' + feature.properties.typ_rd;
        document.getElementById('prox_wat').innerHTML = (feature.properties.prox_wat).toFixed(1);
        document.getElementById('nam_wat').innerHTML = feature.properties.nam_wat;
        document.getElementById('st_num').innerHTML = feature.properties.st_num + ' ';
        document.getElementById('st_nam').innerHTML = feature.properties.st_nam + ' ';
        document.getElementById('st_typ').innerHTML = feature.properties.st_type;
        document.getElementById('nam_bldg').innerHTML = feature.properties.nam_bldg;
        document.getElementById('yr_bldg').innerHTML = feature.properties.yr_bldg;
    }
    
    else if ([zoomlevels[zoomindex]] == 'Dissemination Area') {
       // document.getElementById('idno').innerHTML = feature.properties.dauid;
        document.getElementById('count').innerHTML = feature.properties.bldg_count;
        document.getElementById('area').innerHTML = (feature.properties.avg_area).toFixed(1);
        document.getElementById('prox_bldg').innerHTML = (feature.properties.avg_prox_bldg).toFixed(1);
        document.getElementById('prox_rd').innerHTML = (feature.properties.avg_prox_rd).toFixed(1);
        document.getElementById('prox_wat').innerHTML = (feature.properties.avg_prox_wat).toFixed(1);
            document.getElementById('num_ch').innerHTML = (feature.properties.numchil_16 / feature.properties.bldg_count).toFixed(1);
            document.getElementById('num_ad').innerHTML = (feature.properties.numwork16 / feature.properties.bldg_count).toFixed(1);
            document.getElementById('num_snr').innerHTML = (feature.properties.num_sen_16 / feature.properties.bldg_count).toFixed(1);
    }
    else if ([zoomlevels[zoomindex]] == 'Dissemination Block') {
      //  document.getElementById('idno').innerHTML = feature.properties.dbuid;
        document.getElementById('count').innerHTML = feature.properties.bldg_count;
        document.getElementById('area').innerHTML = feature.properties.avg_area;
        document.getElementById('prox_bldg').innerHTML = (feature.properties.avg_prox_bldg).toFixed(1);
        document.getElementById('prox_rd').innerHTML = (feature.properties.avg_prox_rd).toFixed(1);
        document.getElementById('prox_wat').innerHTML = (feature.properties.avg_prox_wat).toFixed(1);
    }
    
    // Creates a json object to hold the selection
    map.addSource('selectedFeature', {
        "type":"geojson",
        "data": feature.toJSON()
    });
    
    //Adds the selected feature to the map in its own layer
    map.addLayer({ 
        "id": "selectedFeature",
        "type": "line",
        "source": "selectedFeature",
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": { // Styling of click selection
            "line-color": "yellow",
            "line-width": 5
        }
    });    

    // Sets the bounding box to be the extent of the feature selected, and zooms to the extent of that feature. Selectable layer is updated. Extent is saved to array for return to previous extent feature.
    if (zoomindex < 2) { // If more layers are added, update the index to be the index of the odb
        var bbox = turf.extent(feature); 
        fit(bbox);
        zoomindex += 1;
        arr.push(bbox);
    }
});

// Change cursor to a pointer when the mouse hovers over building footprints 
map.on('mouseenter', 'Building Footprints', function () {
	map.getCanvas().style.cursor = 'pointer';
});

// Change cursor back when it leaves building footprints
map.on('mouseleave', 'Building Footprints', function() {
	map.getCanvas().style.cursor = '';
});

// Add navigational controls to the map (zoom in and out buttons and return to North)
map.addControl(new mapboxgl.NavigationControl());

// Toggle buttons to turn data layers on and off
// Text that populates tooltip on hover of layer toggle buttons
// An improvement would be that the tooltip has a delay so the map is not covered unless the user leaves the mouse over the button.
var layerlabels = ['Dissemination areas are inhabited areas composed of 400-700 people and whose boundaries typically follow roads, rivers, power lines, railways or other features.', 'Dissemination blocks are small, city-sized blocks. They are the smallest standard geography used for population and dwelling counts across Canada. They are combined to form larger geographic areas such as dissemination areas, census divisions and federal electoral districts.', 'A building footprint is the outline or perimeter of a building and its enclosed surface area.'];

//Creates a button for each layer listed in list zoomlevels
for (var i=0; i<zoomlevels.length;i++) {
    //extracts the name for the layer to be applied. These names must match the IDs given to layers at map.on('load')
    var id = zoomlevels[i];

    // Sets required attributes to buttons that are able to be switched/toggled on and off
	var link = document.createElement('a');
	link.href = '#';
	link.className = 'active';
	link.textContent = id;
	link.setAttribute("id", id);
	link.setAttribute("data-original-title", layerlabels[i]);
	link.setAttribute("data-toggle", "tooltip");
	link.setAttribute("data-placement", "right");

    // Change visibility of clicked layer button
	link.onclick = function (e) {
		var clickedLayer = this.textContent;
		e.preventDefault();
		e.stopPropagation();
		var visibility = map.getLayoutProperty(clickedLayer,'visibility');
		if (visibility == 'visible') {
			map.setLayoutProperty(clickedLayer,'visibility','none');
			this.className = '';
		} 
        else {
			this.className = 'active';
			map.setLayoutProperty(clickedLayer,'visibility','visible');
		}
	};

    // Adds the buttons to the display
	var layers = document.getElementById('toggle-menu');
	layers.appendChild(link);
}

// Activates functionality for tooltips for layer display buttons
$(document).ready(function(){
	$('[data-toggle="tooltip"]').tooltip();
});
