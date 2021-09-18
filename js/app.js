
////////////////////////////
////// basemap
////////////////////////////

var mymap = L.map('mapid', {
    zoomSnap: 0.25,
    zoomControl: false,
    renderer: L.canvas(),
  }).setView([46.5, 2.55], 5.5555);


  // empecher zoom hors de la bounding box
var bounds = L.latLngBounds([[40, -6], [52, 11]]);
mymap.setMaxBounds(bounds);
mymap.on('drag', function() {
	mymap.panInsideBounds(bounds, { animate: false });
});

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
maxZoom: 12,
minZoom: 6, 
}).addTo(mymap);


////////////////////////////
////// taille points selon zoom
////////////////////////////

var zoomRadius = 0.2;

mymap.on('zoomend', function(e) {
var currentZoom = mymap.getZoom();
console.log("Current Zoom" + " " + currentZoom);
if (currentZoom >= 6 & currentZoom < 7) {
	zoomRadius = 0.4;
	} else if (currentZoom >= 7 & currentZoom < 8) {
	zoomRadius = 0.5;
	} else if (currentZoom >= 8 & currentZoom < 9) {
	zoomRadius = 1;
	} else if (currentZoom >= 9 & currentZoom < 10) {
	zoomRadius = 1.7;
	} else if (currentZoom >= 10 & currentZoom < 11) {
	zoomRadius = 2.5;
	} else if (currentZoom >= 11 & currentZoom <= 12) {
	zoomRadius = 4;
	} else 
	zoomRadius = 0.2;


console.log("Dams Radius" + " " + zoomRadius);
PA.setStyle(stylePoints_PA)//add this line to change the style
PR.setStyle(stylePoints_PR)//add this line to change the style
// points.setStyle(stylePoints)//add this line to change the style
});


////////////////////////////
////// info tooltip
////////////////////////////

// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
};

info.update = function (props) {
	this._div.innerHTML = '<h4>Informations sur la commune :</h4>' +  (props ?
		"<p> Commune : " + '<b>' + props.NOM_COM + '</b><br />' +
		"Population : " + props.population + ' habitants' + "<br>" +
		"Vues : " + props.vues + "<br>" +
	"<a target='_blank' href=  '" + "https://fr.wikipedia.org/wiki/" + props.id_wp_acc_req + "'>Fiche wikipedia</a>"
		: 'Survolez la commune');
};

info.addTo(mymap);




function clickFeature(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 3,
		color: 'red',
		dashArray: '',
		fillOpacity: 0.7
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}

	info.update(layer.feature.properties);
}



function resetHighlight(e) {
	PR.resetStyle(e.target);
	PAf.resetStyle(e.target);
	info.update();
}

function zoomToFeature(e) {
	mymap.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
	layer.on({
		// mouseover: highlightFeature,
		click: clickFeature,
		mouseout: resetHighlight,
		// click: zoomToFeature
	});
}

////////////////////////////
////// appel data
////////////////////////////


var PR = L.geoJSON([communes_infos_wiki], {

style: stylePoints_PR,
onEachFeature: onEachFeature,

pointToLayer: function (feature, latlng) {
return L.circleMarker(latlng);
}
}).addTo(mymap);

var PA = L.geoJSON([communes_infos_wiki], {

	style: stylePoints_PA,
	onEachFeature: onEachFeature,
	
	pointToLayer: function (feature, latlng) {
	return L.circleMarker(latlng);
	}
})




////////////////////////////
////// styles des points
////////////////////////////

function CouleurPopulariteRelative(t) {
return t == "-----" ? '#252525' :
t == "----"  ? '#525252' :
t == "---"  ? '#737373' :
t == "--"  ? '#969696' :
t == "-"   ? '#bdbdbd' :
t == "+" ? '#fde0dd' :
t == "++"  ? '#fcc5c0' :
t == "+++"  ? '#fa9fb5' :
t == "++++"  ? '#f768a1' :
t == "+++++"   ? '#dd3497' :
			'#white';
		}

function CouleurPopulariteAbsolue(nombre_vues) {
	return nombre_vues > 10000000 ? "#000004FF"  :
	nombre_vues > 5000000 ? "#1D1147FF"  :
	nombre_vues > 1000000 ? "#51127CFF"  :
	nombre_vues > 500000 ? "#822681FF" :
	nombre_vues > 200000 ? "#B63679FF"  :
	nombre_vues > 100000 ? "#E65164FF" :
	nombre_vues > 50000 ? "#FB8861FF"  :
	nombre_vues > 20000 ? "#FEC287FF" :
	"#FCFDBFFF";
			}		

			   

function TaillePopulariteAbsolue(nombre_vues) {
	return nombre_vues > 10000000 ? 14 :
	nombre_vues > 5000000 ? 10 :
	nombre_vues > 1000000 ? 8 :
	nombre_vues > 500000 ? 6 :
	nombre_vues > 100000 ? 5 :
	nombre_vues > 50000 ? 4 :
				3;
			}
		

function stylePoints_PR(feature) {
return {
		color: "white",
		fillColor: CouleurPopulariteRelative(feature.properties.reg_abs_quant),
		// fillColor: CouleurPopulariteAbsolue(feature.properties.vues),
		// radius: zoomRadius,
		radius: TaillePopulariteAbsolue(feature.properties.vues) * zoomRadius,
		// radius: TaillePopulariteAbsolue(feature.properties.vues),
		weight: 0.5,
		opacity: 1,
		fillOpacity: 1,
};
}


function stylePoints_PA(feature) {
	return {
			color: "white",
			fillColor: CouleurPopulariteAbsolue(feature.properties.vues),
			// radius: zoomRadius,
			radius: TaillePopulariteAbsolue(feature.properties.vues) * zoomRadius,
			// radius: TaillePopulariteAbsolue(feature.properties.vues) ,
			weight: 0.5,
			opacity: 1,
			fillOpacity: 1,
	};
	}






////////////////////////////
////// légende
////////////////////////////

var PAlegend = L.control({position: 'topright'});
	PAlegend.onAdd = function (map) {
		var div = L.DomUtil.create("div", "legend");
		div.innerHTML += "<h4>Popularité absolue</h4>";
		div.innerHTML += '<i style="background: #000004FF"></i><span>Très populaire</span><br>';
		div.innerHTML += '<i style="background: #1D1147FF"></i><span> </span><br>';
		div.innerHTML += '<i style="background: #51127CFF"></i><span> </span><br>';
		div.innerHTML += '<i style="background: #822681FF"></i><span>Populaire</span><br>';
		div.innerHTML += '<i style="background: #B63679FF"></i><span> </span><br>';
		div.innerHTML += '<i style="background: #E65164FF"></i><span> </span><br>';
		div.innerHTML += '<i style="background: #FB8861FF"></i><span>Peu populaire</span><br>';
		div.innerHTML += '<i style="background: #FEC287FF"></i><span> </span><br>';
		div.innerHTML += '<i style="background: #FCFDBFFF"></i><span> </span><br>';
	
		return div;
        };


// var PAlegend = L.control({position: 'bottomright'});

var PRlegend = L.control({position: 'topright'});
	PRlegend.onAdd = function (map) {
		var div = L.DomUtil.create("div", "legend");
		div.innerHTML += "<h4>Popularité relative</h4>";
		div.innerHTML += '<i style="background: #dd3497"></i><span>Très populaire</span><br>';
		div.innerHTML += '<i style="background: #f768a1"></i><span> </span><br>';
		div.innerHTML += '<i style="background: #fa9fb5"></i><span> </span><br>';
		div.innerHTML += '<i style="background: #fcc5c0"></i><span>Populaire</span><br>';
		div.innerHTML += '<i style="background: #fde0dd"></i><span> </span><br>';
		div.innerHTML += '<i style="background: #bdbdbd"></i><span> </span><br>';
		div.innerHTML += '<i style="background: #969696"></i><span>Peu populaire</span><br>';
		div.innerHTML += '<i style="background: #737373"></i><span> </span><br>';
		div.innerHTML += '<i style="background: #525252"></i><span> </span><br>';
		div.innerHTML += '<i style="background: #252525"></i><span>Très peu populaire</span><br>';
		
		return div;
        };

// PRlegend.addTo(mymap);

////////////////////////////
////// layers
////////////////////////////

	var type_choro = {
		"Popularité relative": PR,
		"Popularité absolue": PA
		};
		
	var overlayMaps = {};
		
	L.control.layers(type_choro, overlayMaps, {
	collapsed:false,
	position:'topright'
	}).addTo(mymap);
		
		
	PRlegend.addTo(mymap);
	currentLegend = PRlegend;


	mymap.on('baselayerchange', function (eventLayer) {
	if (eventLayer.name === 'Popularité absolue') {
	mymap.removeControl(currentLegend );
	currentLegend = PAlegend;
	PAlegend.addTo(mymap);
	} else if (eventLayer.name === 'Popularité relative') {
		mymap.removeControl(currentLegend);
		currentLegend = PRlegend;
		PRlegend.addTo(mymap);
		}
	})

////////////////////////////
////// layers v2
////////////////////////////

// Radio buttons to let the user choose the ethny to use for colors.
// assignClickListener("Popularité relative", onRadioClick);
// assignClickListener("Popularité absolue", onRadioClick);

// function assignClickListener(id, listener) {
//   document.getElementById(id).addEventListener("click", listener);
// }

// function onRadioClick(event) {
//   var target = event.currentTarget,
//     selectedChoro = target.id;

//   console.log(selectedChoro);
//   switch (selectedChoro) {
//     case "Popularité relative":
//       points.setStyle(stylePoints_PR);
//       break;
//     case "Popularité absolue":
//       points.setStyle(stylePoints_PA);
//       break;
//   };
// }