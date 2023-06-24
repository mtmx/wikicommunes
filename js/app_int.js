
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

// bouton zoom emprise max
mymap.addControl(new L.Control.ZoomMin({position:'topleft',
                                        zoomInText: "+",
                                        zoomInTitle: "Zoom +",
                                        zoomOutText: "-",
                                        zoomOutTitle: "Zoom -",
                                        zoomMinText: "Zoom France",
                                        zoomMinTitle: "Zoom France"}));

// bouton geoloc
L.control.locate({
    strings: {
        title: "Géolocalisation"
    }
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
PES.setStyle(stylePoints_PES)//add this line to change the style
PIT.setStyle(stylePoints_PIT)//add this line to change the style
PDE.setStyle(stylePoints_PDE)//add this line to change the style
PEN.setStyle(stylePoints_PEN)//add this line to change the style
PNL.setStyle(stylePoints_PNL)//add this line to change the style
PPT.setStyle(stylePoints_PPT)//add this line to change the style
// PINT.setStyle(stylePoints_PINT)//add this line to change the style
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

function nombreFormat(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

info.update = function (props) {
	this._div.innerHTML = '<h4>Informations sur la commune :</h4>' +  (props ?
		"<p>" + '<big> <b>' + props.LIBGEO + '</big></b><br />' + "<br>" +
		"Population : " + nombreFormat(props.population) + ' habitants' + "<br>" +
		"Vues : " + nombreFormat(Math.ceil(props.vues/1000)*1000) + "<br>" +
		"<small><i>" + "Rang en nombre de vues : # " + nombreFormat(props.n_vues) + "</small></i>" + "<br>" +
		"<small><i>" + "Rang en nombre d'habitants : # " + nombreFormat(props.n_pop) + "</small></i>" + "<br>" + "<br>" +
        // "<img src=" + props.url_img + ">" + "<br>" +
        "<a target='_blank' href=  '" + "https://fr.wikipedia.org/wiki/" + props.id_wp_acc_req + "'><img src=" + props.url_img + "></a>" + "<br>" +
	    "<a target='_blank' href=  '" + "https://fr.wikipedia.org/wiki/" + props.id_wp_acc_req + "'><img src='img/wiki_large.png'></a>"
		: 'Cliquez sur une commune');
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

// function resetHighlight(e) {
// 	PR.resetStyle(e.target);
// 	PA.resetStyle(e.target);
// 	info.update();
// }

function zoomToFeature(e) {
	mymap.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
	layer.on({
		// mouseover: highlightFeature,
		click: clickFeature,
		// mouseout: resetHighlight,
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

// italien
function communes_PIT(feature) {
  if (feature.properties.vues_it > 5000) return true
}

var PIT = L.geoJSON([communes_infos_wiki], {

	style: stylePoints_PIT,
	onEachFeature: onEachFeature,
	filter: communes_PIT,
	pointToLayer: function (feature, latlng) {
	return L.circleMarker(latlng);
	}
})

// espagnol
function communes_PES(feature) {
	if (feature.properties.vues_es > 5000) return true
  }
  
  var PES = L.geoJSON([communes_infos_wiki], {
  
	  style: stylePoints_PES,
	  onEachFeature: onEachFeature,
	  filter: communes_PES,
	  pointToLayer: function (feature, latlng) {
	  return L.circleMarker(latlng);
	  }
  })

  // allemand
function communes_PDE(feature) {
	if (feature.properties.vues_de > 5000) return true
  }
  
  var PDE = L.geoJSON([communes_infos_wiki], {
  
	  style: stylePoints_PDE,
	  onEachFeature: onEachFeature,
	  filter: communes_PDE,
	  pointToLayer: function (feature, latlng) {
	  return L.circleMarker(latlng);
	  }
  })
// anglais
function communes_PEN(feature) {
if (feature.properties.vues_en > 12000) return true
}

var PEN = L.geoJSON([communes_infos_wiki], {

	style: stylePoints_PEN,
	onEachFeature: onEachFeature,
	filter: communes_PEN,
	pointToLayer: function (feature, latlng) {
	return L.circleMarker(latlng);
	}
})

// neerlandais
function communes_PNL(feature) {
	if (feature.properties.vues_nl > 3000) return true
	}
	
	var PNL = L.geoJSON([communes_infos_wiki], {
	
		style: stylePoints_PNL,
		onEachFeature: onEachFeature,
		filter: communes_PNL,
		pointToLayer: function (feature, latlng) {
		return L.circleMarker(latlng);
		}
	})

	// portugais
function communes_PPT(feature) {
	if (feature.properties.vues_pt > 3000) return true
	}
	
	var PPT = L.geoJSON([communes_infos_wiki], {
	
		style: stylePoints_PPT,
		onEachFeature: onEachFeature,
		filter: communes_PPT,
		pointToLayer: function (feature, latlng) {
		return L.circleMarker(latlng);
		}
	})

/* var PINT = L.geoJSON([communes_infos_wiki], {

	style: stylePoints_PINT,
	onEachFeature: onEachFeature,
	
	pointToLayer: function (feature, latlng) {
	return L.circleMarker(latlng);
	}
})  */


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

// function TaillePopulariteAbsolue(nombre_vues) {
// 	return nombre_vues <= 50000 ? 3 :
// 	nombre_vues <= 100000 ? 4 :
// 	nombre_vues <= 500000 ? 5 :
// 	nombre_vues <= 1000000 ? 6 :
// 	nombre_vues <= 5000000 ? 8 :
// 	nombre_vues <= 10000000 ? 10 :
// 	14;
// 			}
		

// vues anglophones

function TaillePopulariteAbsoluePays(nombre_vues) {
	return nombre_vues > 10000000/10 ? 14 :
	nombre_vues > 5000000/10 ? 10 :
	nombre_vues > 1000000/10 ? 8 :
	nombre_vues > 500000/10 ? 6 :
	nombre_vues > 100000/10 ? 5 :
	nombre_vues > 50000/10 ? 4 :
				3;
			}

function CouleurPopularitePays(ratio) {
	return ratio > 3 ? "#b2182b"  :
	ratio > 2 ? "#b2182b"  :
	ratio > 1.5 ? "#d6604d"  :
	ratio > 1.2 ? "#f4a582" :
	ratio > 1 ? "#fddbc7"  :
	ratio > 1/(1.2) ? "#d1e5f0" :
	ratio > 1/(1.5) ? "#92c5de"  :
	ratio > 1/(2) ? "#4393c3" :
	ratio > 1/(3) ? "#2166ac" :
	"#365980";
			}

// vues internationales

function TaillePopulariteAbsolueInt(nombre_vues) {
	return nombre_vues > 10000000 ? 14 :
	nombre_vues > 5000000 ? 10 :
	nombre_vues > 1000000 ? 8 :
	nombre_vues > 500000 ? 6 :
	nombre_vues > 100000 ? 5 :
	nombre_vues > 50000 ? 4 :
				3;
			}

function CouleurPopulariteInt(lang) {
	return lang == "EN" ? 'blue' :
lang == "DE"  ? 'brown' :
lang == "IT"  ? 'green' :
lang == "ES"  ? 'red' :
			'white';
			}



function stylePoints_PR(feature) {
return {
		color: "white",
		fillColor: CouleurPopulariteRelative(feature.properties.reg_abs_quant),
		// fillColor: CouleurPopulariteAbsolue(feature.properties.vues),
		// radius: zoomRadius,
		radius: TaillePopulariteAbsolue(feature.properties.vues) * zoomRadius,
		// radius: TaillePopulariteAbsolue(feature.properties.vues),
		weight: 0.4,
		opacity: 0.8,
		fillOpacity: 1,
};
}


function stylePoints_PA(feature) {
	return {
			color: "#e5e5e5",
			fillColor: CouleurPopulariteAbsolue(feature.properties.vues),
			// radius: zoomRadius,
			radius: TaillePopulariteAbsolue(feature.properties.vues) * zoomRadius,
			// radius: TaillePopulariteAbsolue(feature.properties.vues) ,
			weight: 0.8,
			opacity: 1,
			fillOpacity: 1,
	};
	}


function stylePoints_PIT(feature) {
	return {
			color: "white",
			fillColor: CouleurPopularitePays(feature.properties.vues_it_surrep),
			// fillColor: CouleurPopulariteAbsolue(feature.properties.vues),
			// radius: zoomRadius,
			radius: TaillePopulariteAbsoluePays(feature.properties.vues_it) * zoomRadius,
			// radius: TaillePopulariteAbsolue(feature.properties.vues),
			weight: 0.4,
			opacity: 0.8,
			fillOpacity: 1,
	};
	}

function stylePoints_PES(feature) {
	return {
			color: "white",
			fillColor: CouleurPopularitePays(feature.properties.vues_es_surrep),
			// fillColor: CouleurPopulariteAbsolue(feature.properties.vues),
			// radius: zoomRadius,
			radius: TaillePopulariteAbsoluePays(feature.properties.vues_es) * zoomRadius,
			// radius: TaillePopulariteAbsolue(feature.properties.vues),
			weight: 0.4,
			opacity: 0.8,
			fillOpacity: 1,
	};
	}

function stylePoints_PDE(feature) {
	return {
			color: "white",
			fillColor: CouleurPopularitePays(feature.properties.vues_de_surrep),
			// fillColor: CouleurPopulariteAbsolue(feature.properties.vues),
			// radius: zoomRadius,
			radius: TaillePopulariteAbsoluePays(feature.properties.vues_de) * zoomRadius,
			// radius: TaillePopulariteAbsolue(feature.properties.vues),
			weight: 0.4,
			opacity: 0.8,
			fillOpacity: 1,
	};
	}

function stylePoints_PEN(feature) {
	return {
			color: "white",
			fillColor: CouleurPopularitePays(feature.properties.vues_en_surrep),
			// fillColor: CouleurPopulariteAbsolue(feature.properties.vues),
			// radius: zoomRadius,
			radius: TaillePopulariteAbsoluePays(feature.properties.vues_en) * zoomRadius,
			// radius: TaillePopulariteAbsolue(feature.properties.vues),
			weight: 0.4,
			opacity: 0.8,
			fillOpacity: 1,
	};
	}

function stylePoints_PNL(feature) {
	return {
			color: "white",
			fillColor: CouleurPopularitePays(feature.properties.vues_nl_surrep),
			// fillColor: CouleurPopulariteAbsolue(feature.properties.vues),
			// radius: zoomRadius,
			radius: TaillePopulariteAbsoluePays(feature.properties.vues_nl) * zoomRadius,
			// radius: TaillePopulariteAbsolue(feature.properties.vues),
			weight: 0.4,
			opacity: 0.8,
			fillOpacity: 1,
	};
	}	

function stylePoints_PPT(feature) {
	return {
			color: "white",
			fillColor: CouleurPopularitePays(feature.properties.vues_pt_surrep),
			// fillColor: CouleurPopulariteAbsolue(feature.properties.vues),
			// radius: zoomRadius,
			radius: TaillePopulariteAbsoluePays(feature.properties.vues_pt) * zoomRadius,
			// radius: TaillePopulariteAbsolue(feature.properties.vues),
			weight: 0.4,
			opacity: 0.8,
			fillOpacity: 1,
	};
	}	


/* 
function stylePoints_PINT(feature) {
	return {
			color: "white",
			fillColor: CouleurPopulariteInt(feature.properties.max_lang),
			// fillColor: CouleurPopulariteAbsolue(feature.properties.vues),
			// radius: zoomRadius,
			radius: TaillePopulariteAbsolueInt(feature.properties.vues_int) * zoomRadius,
			// radius: TaillePopulariteAbsolue(feature.properties.vues),
			weight: 0.4,
			opacity: 0.8,
			fillOpacity: 1,
	};
	} */

////////////////////////////
////// légende
////////////////////////////

var PAlegend = L.control({position: 'topright'});
	PAlegend.onAdd = function (map) {
		var div = L.DomUtil.create("div", "legend");
		div.innerHTML += "<h4>Popularité absolue</h4>";
		div.innerHTML += '<i style="background: #000004FF"></i><span>> 10 M vues</span><br>';
		div.innerHTML += '<i style="background: #1D1147FF"></i><span>> 5 M vues </span><br>';
		div.innerHTML += '<i style="background: #51127CFF"></i><span>> 1 M vues </span><br>';
		div.innerHTML += '<i style="background: #822681FF"></i><span>> 500 k vues</span><br>';
		div.innerHTML += '<i style="background: #B63679FF"></i><span>> 200 k vues </span><br>';
		div.innerHTML += '<i style="background: #E65164FF"></i><span>> 100 k vues </span><br>';
		div.innerHTML += '<i style="background: #FB8861FF"></i><span>> 50 k vues </span><br>';
		div.innerHTML += '<i style="background: #FEC287FF"></i><span>> 20 k vues </span><br>';
		div.innerHTML += '<i style="background: #FCFDBFFF"></i><span>< 20 k vues  </span><br>';
	
		return div;
        };


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

var PPayslegend = L.control({position: 'topright'});
PPayslegend.onAdd = function (map) {
	var div = L.DomUtil.create("div", "legend");
	div.innerHTML += "<h4>Popularité (vs France)</h4>";
	div.innerHTML += '<i style="background: #b2182b"></i><span>Plus populaire</span><br>';
	div.innerHTML += '<i style="background: #b2182b"></i><span> </span><br>';
	div.innerHTML += '<i style="background: #d6604d"></i><span> </span><br>';
	div.innerHTML += '<i style="background: #f4a582"></i><span> </span><br>';
	div.innerHTML += '<i style="background: #fddbc7"></i><span> </span><br>';
	div.innerHTML += '<i style="background: #d1e5f0"></i><span>Autant populaire </span><br>';
	div.innerHTML += '<i style="background: #92c5de"></i><span> </span><br>';
	div.innerHTML += '<i style="background: #4393c3"></i><span> </span><br>';
	div.innerHTML += '<i style="background: #2166ac"></i><span> </span><br>';
	div.innerHTML += '<i style="background: #365980"></i><span>Moins populaire</span><br>';
	
	return div;
	};
	

/* var PINTlegend = L.control({position: 'topright'});
PINTlegend.onAdd = function (map) {
	var div = L.DomUtil.create("div", "legend");
	div.innerHTML += "<h4>Popularité internationale</h4>";
	div.innerHTML += '<i style="background: blue"></i><span>> Anglais</span><br>';
	div.innerHTML += '<i style="background: brown"></i><span>> Allemand </span><br>';
	div.innerHTML += '<i style="background: green"></i><span>> Italien </span><br>';
	div.innerHTML += '<i style="background: red"></i><span>> Espagnol</span><br>';
	
	return div;
	};	 */


////////////////////////////
////// layers
////////////////////////////

	var type_choro = {
		"Popularité relative": PR,
		"Popularité absolue": PA,
		"Popularité anglophone": PEN,
		"Popularité allemande": PDE,
		"Popularité italienne": PIT,
		"Popularité espagnole": PES,
		"Popularité néerlandaise": PNL,
		"Popularité portugaise": PPT
		// "Popularité internationale": PINT
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
		} else if (eventLayer.name === 'Popularité italienne') {
			mymap.removeControl(currentLegend);
			currentLegend = PPayslegend;
			PPayslegend.addTo(mymap);
			} else if (eventLayer.name === 'Popularité espagnole') {
				mymap.removeControl(currentLegend);
				currentLegend = PPayslegend;
				PPayslegend.addTo(mymap);
				} else if (eventLayer.name === 'Popularité allemande') {
					mymap.removeControl(currentLegend);
					currentLegend = PPayslegend;
					PPayslegend.addTo(mymap);
					} else if (eventLayer.name === 'Popularité anglophone') {
						mymap.removeControl(currentLegend);
						currentLegend = PPayslegend;
						PPayslegend.addTo(mymap);
						} else if (eventLayer.name === 'Popularité néerlandaise') {
							mymap.removeControl(currentLegend);
							currentLegend = PPayslegend;
							PPayslegend.addTo(mymap);
							} else if (eventLayer.name === 'Popularité portugaise') {
								mymap.removeControl(currentLegend);
								currentLegend = PPayslegend;
								PPayslegend.addTo(mymap);
								}
	// } else if (eventLayer.name === 'Popularité internationale') {
	// 	mymap.removeControl(currentLegend);
	// 	currentLegend = PINTlegend;
	// 	PINTlegend.addTo(mymap);
	// 	}
	})

////////////////////////////
////// sidebar
////////////////////////////

     // create the sidebar instance and add it to the map
	 var sidebar = L.control.sidebar({ 
		autopan: false,       // whether to maintain the centered map point when opening the sidebar
		closeButton: false,    // whether t add a close button to the panes
		container: 'sidebar', // the DOM container or #ID of a predefined sidebar container that should be used
		position: 'left',     // left or right
		})
	 .addTo(mymap);

