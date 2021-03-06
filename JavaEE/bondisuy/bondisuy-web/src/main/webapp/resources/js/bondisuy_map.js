

//Capa de Vista
var view = new ol.View({
	projection: 'EPSG:4326',
	//projection: projection32721,
	center: ol.proj.fromLonLat([-56.17938, -34.86157]),
	zoom: ZOOMDEFECTO,
	minZoom: ZOOMDEFECTOMIN,
	maxZoom: ZOOMDEFECTOMAX,
});
//Fin Capa de Vista

function removeAllLayers() {
	var layerArray, len, layer;
	layerArray = map.getLayers().getArray(),

		len = layerArray.length;

	for (var i = len - 1; i > 1; i--) {
		layer = layerArray[i];
		map.removeLayer(layer);
	}

}

//Agregar boton ir a mi ubicacion actual
var CenterZoomMapControl = (function(Control) {
	function CenterZoomMapControl(opt_options) {
		var options = opt_options || {};

		var button = document.createElement('button');
		button.title = "Mi ubicaci\u00F3n"
		button.innerHTML = '<i class="mdi mdi-crosshairs-gps"></i>';

		var element = document.createElement('div');
		element.className = 'bondisuy-centerzoom-map ol-unselectable ol-control';
		element.appendChild(button);

		ol.control.Control.call(this, {
			element: element,
			target: options.target
		});

		button.addEventListener('click', this.handleCenterZoomMap.bind(this), false);

	}

	if (ol.control.Control) CenterZoomMapControl.__proto__ = ol.control.Control;
	CenterZoomMapControl.prototype = Object.create(ol.control.Control && Control.prototype);
	CenterZoomMapControl.prototype.constructor = CenterZoomMapControl;

	CenterZoomMapControl.prototype.handleCenterZoomMap = function handleCenterZoomMap() {
		if (coordinates != null) {
			centerMap(coordinates);
		}
	};


	return CenterZoomMapControl;
}(ol.control.Control));
//Fin Agregar boton ir

//Source de Nueva Localizacion
var sourceNuevaLocalizacion = new ol.source.Vector({
	wrapX: false,
});

//Vector de Nueva Localización
var vectorNuevaLocalizacion = new ol.layer.Vector({
	source: sourceNuevaLocalizacion,
	style: IconLocalizacionStyle,
});

// removes the last feature from the vector source.
var removeLastFeature = function() {
	if (lastFeature)
		sourceNuevaLocalizacion.removeFeature(lastFeature);
};




function addInteraction() {
	//Se deshabilita la geolocalizacion
	geolocation.setTracking(false);

	var drawNuevaLocalizacion = new ol.interaction.Draw({
		source: sourceNuevaLocalizacion,
		type: 'Point',
	});

	sourceNuevaLocalizacion.on('addfeature', function(evt) {
		removeAllLayers();
		var feature = evt.feature;
		coordinates = feature.getGeometry().getCoordinates();

		feature.setProperties({
			name: "Mi Ubicaci\u00F3nn",
			tipo: 'localizacion',
		})

		var point = new Proj4js.Point(coordinates);   //any object will do as long as it has 'x' and 'y' properties
		var point32721 = Proj4js.transform(proj4326, proj32721, point);      //do the transformation.  x and y are modified in place

		getParadasCercanas([point32721['x'], point32721['y']], DISTANCIA);

		var card = $ds("#to_do_some");
		var card_title = $ds(card).find("h6.card-title");
		var card_subtitle = $ds(card).find("h7.card-title");
		var form_group = $ds(card).find(".form-group");

		$ds(card_title).html("L&iacute;neas cercanas");

		getRecorridoCercanos([point32721['x'], point32721['y']], DISTANCIA);

		map.removeInteraction(drawNuevaLocalizacion);
	});

	drawNuevaLocalizacion.on('drawend', function(evt) {
		removeLastFeature();
		lastFeature = evt.feature;
		map.removeInteraction(drawNuevaLocalizacion);
		removeLocFeature();

	});

	map.addInteraction(drawNuevaLocalizacion);
}

var SetUbicacion = (function(Control) {
	function SetUbicacion(opt_options) {
		var options = opt_options || {};

		var button = document.createElement('button');
		button.title = "Corregir ubicaci\u00F3n"
		button.innerHTML = '<i class="mdi mdi-crosshairs"></i>';

		var element = document.createElement('div');
		element.className = 'bondisuy-setubicacion-map ol-unselectable ol-control';
		element.appendChild(button);

		ol.control.Control.call(this, {
			element: element,
			target: options.target
		});

		button.addEventListener('click', this.handleSetUbicacion.bind(this), false);
	}

	if (ol.control.Control) SetUbicacion.__proto__ = ol.control.Control;
	SetUbicacion.prototype = Object.create(ol.control.Control && Control.prototype);
	SetUbicacion.prototype.constructor = SetUbicacion;

	SetUbicacion.prototype.handleSetUbicacion = function handleSetUbicacion() {

		if (coordinates != null) {
			addInteraction();
		}
	};

	return SetUbicacion;
}(ol.control.Control));
//Fin Agregar Corregir ubicacion

//Usar la locaclizacion actual
var geolocation = new ol.Geolocation({

	// enableHighAccuracy must be set to true to have the heading value.
	trackingOptions: {
		enableHighAccuracy: true,
	},
	projection: view.getProjection(),
});

//handle geolocation error.
geolocation.on('error', function(error) {
	bondisuy_msgError("Error al obtener la localizaci\u00F3n del dispositivo\n [" + error.message + "]");

	cleanInteraction();
	removeAllLayers();
});



var accuracyFeature = new ol.Feature();

geolocation.on('change:accuracyGeometry', function() {
	//accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
});

//Central el mapa en la localizacion actual

var positionFeature = new ol.Feature({
	//name: "<div id='ver_Lineas_Cercanas'><a href='javascript:verLineasCercanas();'><i class='mdi mdi-eye'></i> Ver L\u00EDneas Cercanas</a></div>",
	name: "Mi Ubicaci\u00F3n",
	tipo: 'localizacion',
});

positionFeature.setStyle(IconLocalizacionStyle);


geolocation.on('change:position', function() {
	coordinates = geolocation.getPosition();
	positionFeature.setGeometry(coordinates ? new ol.geom.Point(coordinates) : null);

	var size = map.getSize();
	var x = document.getElementById("map").clientWidth / 2;
	var y = document.getElementById("map").clientHeight / 2;

	view.centerOn(coordinates, size, [x, y]);

	var point = new Proj4js.Point(coordinates);   //any object will do as long as it has 'x' and 'y' properties
	var point32721 = Proj4js.transform(proj4326, proj32721, point);      //do the transformation.  x and y are modified in place

	getParadasCercanas([point32721['x'], point32721['y']], DISTANCIA);


	var card = $ds("#to_do_some");
	var card_title = $ds(card).find("h6.card-title");
	var card_subtitle = $ds(card).find("h7.card-title");
	var form_group = $ds(card).find(".form-group");

	$ds(card_title).html("L&iacute;neas cercanas");

	getRecorridoCercanos([point32721['x'], point32721['y']], DISTANCIA);

});

// remove localizacion detectada 
var removeLocFeature = function() {
	sourceLocActual.clear();

};
//Fin de localización actual

//Definicion de capas
var layers = [
	new ol.layer.Tile({
		source: new ol.source.OSM(),
	}),
	vectorNuevaLocalizacion,

];


//Creacion de mapa
var map = new ol.Map({
	layers: layers,
	controls: ol.control.defaults().extend([new CenterZoomMapControl(), new SetUbicacion()]),
	target: 'map',
	view: view,
});
//Fin de creacion de mapa

//Modificacion de mapa con ubicación actual
var sourceLocActual = new ol.source.Vector({
	features: [accuracyFeature, positionFeature],
});

var vectorLocActual = new ol.layer.Vector({
	map: map,
	source: sourceLocActual,
	zIndex: 2,
});

//Se habilita la geolocalizacion
geolocation.setTracking(true);
//Fin de modificacion de mapa con ubicación actual

//Se arregla texto del zoom-out
var button = $ds("button.ol-zoom-out");
$ds(button).html("-");

//Creacion de marcadores 
//List de objetos: {descripcion: TEXT, coordenadas: [lat, long], img: SRC }
function addMarcadores(list, typeSource) {
	var marcadores = [];

	for (var lst in list) {
		let marcador = new ol.Feature({
			geometry: new ol.geom.Point(list[lst]['coordenadas']),// En dónde se va a ubicar
			name: list[lst]['descripcion']
		});

		// Agregamos icono
		let IconStyle = new ol.style.Style({
			image: new ol.style.Icon({
				anchor: [0.5, 46],
				anchorXUnits: 'fraction',
				anchorYUnits: 'pixels',
				opacity: 1,
				src: list[lst]['img']
			}),
		});
		marcador.setStyle(IconStyle);

		marcadores.push(marcador);// Agregamos el marcador al arreglo
	}

	var marcadoresSource = new ol.source.Vector({
		options: {
			projection: projectionSRS,
		},
		features: marcadores, // Ponemos los marcadores a la capa
	});

	var capa = new ol.layer.Vector({
		name: typeSource,
		source: marcadoresSource,
		minZoom: MINZOOM,
		zIndex: 3,
	});

	// Agregamos la capa al mapa
	map.addLayer(capa);
	bondisuy_LoadHide();
}

//Creacion de lineas 
//List de objetos: {descripcion: TEXT, coordenadas: [[lat, long],[lat, long]], color: HEX }
function addRecorrido(list, typeSource) {
	var recorridos = [];

	for (var lst in list) {
		let recorrido = new ol.Feature({
			geometry: new ol.geom.LineString(list[lst]['coordenadas']),// Como va a ser
			name: list[lst]['descripcion']
		});

		// Agregamos estilo
		let routeStyle = new ol.style.Style({
			stroke: new ol.style.Stroke({
				width: 6,
				color: list[lst]['color'],
			}),
		});
		recorrido.setStyle(routeStyle);

		recorridos.push(recorrido);// Agregamos el recorrido  al arreglo
	}

	var recorridosSource = new ol.source.Vector({
		options: {
			projection: projectionSRS,
		},
		features: recorridos, // Ponemos los recorridos en la capa
	});

	var capa = new ol.layer.Vector({
		name: typeSource,
		source: recorridosSource,
		zIndex: 4,
	});

	// Agregamos la capa al mapa
	map.addLayer(capa);
	bondisuy_LoadHide();

}


var element = document.getElementById('mappopup');

var popup = new ol.Overlay({
	element: element,
	positioning: 'bottom-center',
	stopEvent: true,
	offset: [0, -45],

});

map.addOverlay(popup);

map.on('click', function(evt) {
	var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
		return feature;
	});

	$ds('#mappopup').popover('dispose');



	if (feature) {
		if (feature.getGeometry().getType() == 'Point') {
			popup.setPosition(feature.getGeometry().getCoordinates());
			popup.setOffset([0, -45]);

		} else if (feature.getGeometry().getType() == 'LineString') {
			popup.setPosition(evt.coordinate);
			popup.setOffset([0, -5]);

		}

		var contenido = '';

		if (feature.get('name') != undefined) {
			contenido = feature.get('name');
			$ds('#mappopup').popover('dispose');
		}

		$ds('#mappopup').popover({
			title: 'Informaci\u00F3n',
			content: contenido,
			html: true,
			placement: 'top',
		});

		if (feature.get('tipo') == 'localizacion') {
			popup.setOffset([0, -12]);
		}

		if (!(feature.get('name') == undefined || feature.get('name') == ""))
			$ds('#mappopup').popover('show');

		
		$ds("#ver_Lineas_Paradas").on("click", function() {
			var divID = $ds(this).find("div[id*='id_parada:_:']").attr('id');
			var auxID = divID.split(":_:");
			var paradaID = auxID[1];

			var card = $ds("#to_do_some");
			var card_title = $ds(card).find("h6.card-title");
			var card_subtitle = $ds(card).find("h7.card-title");
			var form_group = $ds(card).find(".form-group");

			$ds(card_title).html("Parada " + paradaID);
			// $ds(card_subtitle).html("L&iacute;nea");
			$ds(card_subtitle).html("");

			var point = new Proj4js.Point(coordinates);   //any object will do as long as it has 'x' and 'y' properties
			var point32721 = Proj4js.transform(proj4326, proj32721, point);      //do the transformation.  x and y are modified in place

			var databody = $ds("#selectTableLineas").children("table").get(0);
			$ds(databody).off("click");

			getParadaLineaHorario(paradaID);

			$ds(databody).off("click");

			/*
			$ds(databody).on('click', 'tr', function() {
				if ($ds(this).hasClass('selected')) {
					$ds(this).removeClass('selected');
				}
				else {
					recorrido = $ds(this).attr('data-counter_id');

					$ds('#selectTableLineas tr.selected').removeClass('selected');
					$ds(this).addClass('selected');

					bondisuy_LoadShow();
					getRecorrido(recorrido);

				}
			});
			*/

		});

		$ds("#ver_Todas_Lineas_Paradas").on("click", function() {
			var divID = $ds(this).find("div[id*='ver_todas_id_lineas:_:']").attr('id');
			var auxID = divID.split(":_:");
			var paradaID = auxID[1];

			var card = $ds("#to_do_some");
			var card_title = $ds(card).find("h6.card-title");
			var card_subtitle = $ds(card).find("h7.card-title");
			var form_group = $ds(card).find(".form-group");

			$ds(card_title).html("Parada " + paradaID);
			// $ds(card_subtitle).html("L&iacute;nea");
			$ds(card_subtitle).html("");

			var point = new Proj4js.Point(coordinates);   //any object will do as long as it has 'x' and 'y' properties
			var point32721 = Proj4js.transform(proj4326, proj32721, point);      //do the transformation.  x and y are modified in place

			var databody = $ds("#selectTableLineas").children("table").get(0);
			$ds(databody).off("click");

			getParadaLineaTodas(paradaID);

			$ds(databody).off("click");

			$ds(databody).on('click', 'tr', function() {
				if ($ds(this).hasClass('selected')) {
					$ds(this).removeClass('selected');
				}
				else {
					recorrido = $ds(this).attr('data-counter_id');

					$ds('#selectTableLineas tr.selected').removeClass('selected');
					$ds(this).addClass('selected');

					bondisuy_LoadShow();
					//getRecorrido(recorrido);
					getRecorridoVERParada(recorrido);
				}
			});

		});

		$ds("#editar_Todas_Lineas_Paradas").on("click", function() {
			var divID = $ds(this).find("div[id*='editar_todas_id_lineas:_:']").attr('id');
			var auxID = divID.split(":_:");
			var paradaID = auxID[1];

			searchOptions(9);

			$ds("#inputEditParada").val(paradaID);
			$ds("#inputEditParada").keypress();

			var databody = $ds("#selectTableLineas").children("table").get(0);
			$ds(databody).find('tr[data-counter_id="' + paradaID + '"]').keypress();

		});

		// Doble click en eliminar una parada
		$ds("#eliminar_parada").on("click", function() {
			var divID = $ds(this).find("div[id*='eliminar_parada:_:']").attr('id');
			var auxID = divID.split(":_:");
			var paradaID = auxID[1];

			console.log("Eliminar parada: " + paradaID);
			$ds('#idEliminarParada').text(paradaID);
			$ds('#deleteParada').modal('show');
		});

		// Doble click en eliminar una parada
		$ds("#eliminar_recorrido").on("click", function() {
			var divID = $ds(this).find("div[id*='eliminar_recorrido:_:']").attr('id');
			var auxID = divID.split(":_:");
			var recorridoID = auxID[1];

			console.log("Eliminar recorrido: " + recorridoID);
			$ds('#idEliminarRecorrido').text(recorridoID);
			$ds('#deleteRecorrido').modal('show');
		});

		feature = undefined;
	} else {
		$ds('#mappopup').popover('dispose');
	}
});

function centerMap(center) {
	map.getView().setCenter(center);
	map.getView().setZoom(ZOOMDEFECTO);
}

function centerMapLinea(center) {
	map.getView().setCenter(center);
	map.getView().setZoom(ZOOMLINEA);
}


function borrarCapaPorNombre(nombre) {
	for (var lay in map.getLayers().getArray()) {
		if (!(lay instanceof ol.layer.Group)) {
			var layer = map.getLayers().getArray()[lay];

			//console.log(layer.get('name'));

			if (layer.get('name') == nombre) {
				map.removeLayer(layer);
			}
		}
	}
}


//Source de Nueva Parada
var sourceNuevaParada = new ol.source.Vector({
	wrapX: false,
});

var snapNuevaParada = new ol.interaction.Snap({
	source: sourceNuevaParada
});

var modifyNuevaParada = new ol.interaction.Modify({
	source: sourceNuevaParada
});


// removes the last feature from the vector source.
var removeLastNuevaParada = function() {
	//console.log(lastFeatureNuevaParada);
	if (lastFeatureNuevaParada) {
		sourceNuevaParada.removeFeature(lastFeatureNuevaParada);
		modifyNuevaParada.removeFeature(lastFeatureNuevaParada);
	}

};


function addParada() {
	//Se deshabilita la geolocalizacion
	geolocation.setTracking(false);

	var drawNuevaParada = new ol.interaction.Draw({
		name: L_NUEVAPARADA,
		source: sourceNuevaParada,
		type: 'Point',
	});

	//Vector de Nueva Parada
	var vectorNuevaParada = new ol.layer.Vector({
		name: L_NUEVAPARADA,
		source: sourceNuevaParada,
		style: IconNuevaParadaStyle,
	});

	sourceNuevaParada.on('addfeature', function(evt) {
		//removeLastNuevaParada();
		lastFeatureNuevaParada = evt.feature;

		var feature = evt.feature;
		coordNuevaParada = feature.getGeometry().getCoordinates();

		feature.setProperties({
			name: "Nueva Parada",
			tipo: 'nuevaparada',
		})

		map.removeInteraction(drawNuevaParada);
		map.removeInteraction(snapNuevaParada);

	});

	modifyNuevaParada.on('modifyend', function(evt) {
		var features = evt.features.getArray();
		for (var i = 0; i < features.length; i++) {
			coordNuevaParada = features[i].getGeometry().getCoordinates();
		}

	});


	// Agregamos la capa al mapa
	map.addLayer(vectorNuevaParada);

	map.addInteraction(modifyNuevaParada);
	map.addInteraction(drawNuevaParada);
	map.addInteraction(snapNuevaParada);

}

//Source de Nueva Parada
var sourceNuevaLinea = new ol.source.Vector({
	wrapX: false,
});

var snapNuevaLinea = new ol.interaction.Snap({
	source: sourceNuevaLinea
});

var modifyNuevaLinea = new ol.interaction.Modify({
	source: sourceNuevaLinea
});


// removes the last feature from the vector source.
var removeLastNuevaLinea = function() {
	//console.log(lastFeatureNuevaLinea);
	if (lastFeatureNuevaLinea) {
		sourceNuevaLinea.removeFeature(lastFeatureNuevaLinea);
		modifyNuevaLinea.removeFeature(lastFeatureNuevaLinea);
	}

};

function addLinea() {
	//Se deshabilita la geolocalizacion
	geolocation.setTracking(false);

	var drawNuevaLinea = new ol.interaction.Draw({
		name: L_NUEVALINEA,
		source: sourceNuevaLinea,
		type: 'LineString',
	});

	//Vector de Nueva Parada
	var vectorNuevaLinea = new ol.layer.Vector({
		name: L_NUEVALINEA,
		source: sourceNuevaLinea,
		style: StrokeNuevaLineaStyle,
	});

	sourceNuevaLinea.on('addfeature', function(evt) {
		//removeLastNuevaParada();
		lastFeatureNuevaLinea = evt.feature;

		var feature = evt.feature;
		coordNuevaLinea = feature.getGeometry().getCoordinates();

		feature.setProperties({
			name: "Nueva L\u00EDnea",
			tipo: 'nuevaparada',
		})

		map.removeInteraction(drawNuevaLinea);
		map.removeInteraction(snapNuevaLinea);

	});

	modifyNuevaLinea.on('modifyend', function(evt) {

		coordNuevaLinea = evt.features.getArray();

	});


	// Agregamos la capa al mapa
	map.addLayer(vectorNuevaLinea);

	map.addInteraction(modifyNuevaLinea);
	map.addInteraction(drawNuevaLinea);
	map.addInteraction(snapNuevaLinea);
}


//Source de Nueva Parada
var sourceZonaLinea = new ol.source.Vector({
	wrapX: false,
});

var snapZonaLinea = new ol.interaction.Snap({
	source: sourceZonaLinea
});

var modifyZonaLinea = new ol.interaction.Modify({
	source: sourceZonaLinea
});


// removes the last feature from the vector source.
var removeLastZonaLinea = function() {
	if (lastFeatureNuevaLinea) {
		sourceZonaLinea.removeFeature(lastFeatureZonaLinea);
		modifyZonaLinea.removeFeature(lastFeatureZonaLinea);
	}

};

function addZonaLinea() {
	//Se deshabilita la geolocalizacion
	geolocation.setTracking(false);

	var drawZonaLinea = new ol.interaction.Draw({
		name: L_ZONA,
		source: sourceZonaLinea,
		type: 'Polygon',
	});

	//Vector de Nueva Parada
	var vectorZonaLinea = new ol.layer.Vector({
		name: L_ZONA,
		source: sourceZonaLinea,
		style: StrokeZonaLineaStyle,
	});

	sourceZonaLinea.on('addfeature', function(evt) {
		//removeLastNuevaParada();
		lastFeatureZonaLinea = evt.feature;

		var feature = evt.feature;
		coordZonaLinea = feature.getGeometry().getCoordinates();

		feature.setProperties({
			name: "Zona de b\u00FAsqueda",
			tipo: 'nuevazona',
		})

		map.removeInteraction(drawZonaLinea);
		map.removeInteraction(snapZonaLinea);

	});

	modifyZonaLinea.on('modifyend', function(evt) {

		var features = evt.features.getArray();
		for (var i = 0; i < features.length; i++) {
			coordZonaLinea = features[i].getGeometry().getCoordinates();
		}

	});


	// Agregamos la capa al mapa
	map.addLayer(vectorZonaLinea);

	map.addInteraction(modifyZonaLinea);
	map.addInteraction(drawZonaLinea);
	map.addInteraction(snapZonaLinea);
}


//Source de Nueva Parada
var sourceUPDLinea = new ol.source.Vector({
	wrapX: false,
});

var snapUPDLinea = new ol.interaction.Snap({
	source: sourceUPDLinea
});

var modifyUPDLinea = new ol.interaction.Modify({
	source: sourceUPDLinea
});


//Modificacion de lineas 
//List de objetos: {descripcion: TEXT, coordenadas: [[lat, long],[lat, long]], color: HEX }
function addUPDRecorrido(list, typeSource) {
	var recorridos = [];

	//console.log(list.length);

	for (var lst in list) {
		let recorrido = new ol.Feature({
			geometry: new ol.geom.LineString(list[lst]['coordenadas']),// Como va a ser
			name: list[lst]['descripcion'],
			id: typeSource,
		});

		// Agregamos estilo
		let routeStyle = new ol.style.Style({
			stroke: new ol.style.Stroke({
				width: 4,
				color: list[lst]['color'],
			}),
		});
		recorrido.setStyle(routeStyle);

		recorridos.push(recorrido);// Agregamos el recorrido  al arreglo
	}

	for (var f in sourceUPDLinea.getFeatures()) {
		sourceUPDLinea.removeFeature(sourceUPDLinea.getFeatures()[f]);
	}

	sourceUPDLinea.addFeatures(recorridos);

	//Vector de Nueva Parada
	var vectorUPDLinea = new ol.layer.Vector({
		name: typeSource,
		source: sourceUPDLinea,
		//style: StrokeZonaLineaStyle,
	});

	sourceUPDLinea.on('addfeature', function(evt) {
		//removeLastNuevaParada();
		lastFeatureUPDLinea = evt.feature;

		var feature = evt.feature;
		coordUPDLinea = feature.getGeometry().getCoordinates();

		map.removeInteraction(snapUPDLinea);

	});

	modifyUPDLinea.on('modifyend', function(evt) {
		var features = evt.features.getArray();
		for (var i = 0; i < features.length; i++) {
			coordUPDLinea = features[i].getGeometry().getCoordinates();
		}

	});

	// Agregamos la capa al mapa
	map.addLayer(vectorUPDLinea);

	map.addInteraction(modifyUPDLinea);
	//	map.addInteraction(drawUPDLinea);
	map.addInteraction(snapUPDLinea);

}


//Source de Nueva Parada
var sourceUPDParada = new ol.source.Vector({
	wrapX: false,
});

var snapUPDParada = new ol.interaction.Snap({
	source: sourceUPDParada
});

var modifyUPDParada = new ol.interaction.Modify({
	source: sourceUPDParada
});


//Modificacion de Paradas 
//List de objetos: {descripcion: TEXT, coordenadas: [[lat, long],[lat, long]], color: HEX }
function addUPDParada(list, typeSource) {
	var paradas = [];

	for (var lst in list) {
		let parada = new ol.Feature({
			geometry: new ol.geom.Point(list[lst]['coordenadas']),// En dónde se va a ubicar
			name: list[lst]['descripcion'],
			id: typeSource,
		});

		coordUPDParada = list[lst]['coordenadas'];
		paradas.push(parada);// Agregamos el recorrido  al arreglo
		//console.log(coordUPDParada);
	}

	for (var f in sourceUPDParada.getFeatures()) {
		sourceUPDParada.removeFeature(sourceUPDParada.getFeatures()[f]);
	}

	sourceUPDParada.addFeatures(paradas);

	//Vector de Nueva Parada
	var vectorUPDParada = new ol.layer.Vector({
		name: typeSource,
		source: sourceUPDParada,
		style: IconNuevaParadaStyle,
		//style: StrokeZonaLineaStyle,
	});

	sourceUPDLinea.on('addfeature', function(evt) {
		//removeLastNuevaParada();
		lastFeatureUPDParada = evt.feature;

		var feature = evt.feature;
		coordUPDParada = feature.getGeometry().getCoordinates();

		map.removeInteraction(snapUPDParada);

		//console.log(coordUPDParada);
	});

	modifyUPDParada.on('modifyend', function(evt) {
		var features = evt.features.getArray();

		for (var i = 0; i < features.length; i++) {
			coordUPDParada = features[i].getGeometry().getCoordinates();
			updParadaGeo = true;
		}

		//console.log(coordUPDParada);
	});

	// Agregamos la capa al parada
	map.addLayer(vectorUPDParada);

	map.addInteraction(modifyUPDParada);
	map.addInteraction(snapUPDParada);

}

/* Mapa de calor de paradas */
function agregarMapaDeCalorDeParadas() {

	var capaCalor = new ol.layer.Heatmap({
		source: new ol.source.Vector({
			format: new ol.format.GeoJSON(),
			url: function(extent) {
				return '/geoserver/bondisuy/ows?service=WFS&version=1.0.0&srsName=epsg:4326&request=GetFeature&typeName=bondisuy:ft_paradas&outputFormat=application/json';
			}
		})
	});

	map.addLayer(capaCalor);

}


function cleanInteraction() {
	//	map.removeInteraction(drawNuevaParada);
	map.removeInteraction(snapNuevaParada);
	//	map.removeInteraction(drawZonaLinea);
	map.removeInteraction(snapZonaLinea);
	//	map.removeInteraction(drawNuevaLinea);
	map.removeInteraction(snapNuevaLinea);

	for (var f in sourceUPDParada.getFeatures()) {
		sourceUPDParada.removeFeature(sourceUPDParada.getFeatures()[f]);
	}

	for (var f in sourceUPDLinea.getFeatures()) {
		sourceUPDLinea.removeFeature(sourceUPDLinea.getFeatures()[f]);
	}

}







