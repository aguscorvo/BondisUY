

//Capa de Vista
var view = new ol.View({
	projection: 'EPSG:4326',
	//projection: projection32721,
	center: ol.proj.fromLonLat([-56.17938, -34.86157]),
	zoom: ZOOMDEFECTO,
	minZoom: 12,
	maxZoom: 16,
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
			//this.getMap().getView().setCenter(coordinates);
			//this.getMap().getView().setZoom(15);
			centerMap(coordinates);
		}
	};


	return CenterZoomMapControl;
}(ol.control.Control));
//Fin Agregar boton ir

//Source de Nueva Localizacion
var sourceNuevaLocalizacion = new ol.source.Vector({
	name: 'NuevaLocalizacion',
	wrapX: false,
});

//Vector de Nueva Localización
var vectorNuevaLocalizacion = new ol.layer.Vector({
	source: sourceNuevaLocalizacion,
	style: styles[0],
});

// removes the last feature from the vector source.
var removeLastFeature = function() {
	if (lastFeature)
		sourceNuevaLocalizacion.removeFeature(lastFeature);
};

function addInteraction() {
	//Se deshabilita la geolocalizacion
	geolocation.setTracking(false);

	drawNuevaLocalizacion = new ol.interaction.Draw({
		source: sourceNuevaLocalizacion,
		type: 'Point',
	});

	sourceNuevaLocalizacion.on('addfeature', function(evt) {
		removeAllLayers();
		var feature = evt.feature;
		coordinates = feature.getGeometry().getCoordinates();

		var point = new Proj4js.Point(coordinates);   //any object will do as long as it has 'x' and 'y' properties
		var point32721 = Proj4js.transform(proj4326, proj32721, point);      //do the transformation.  x and y are modified in place

		getParadasCercanas([point32721['x'], point32721['y']], DISTANCIA);
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

// handle geolocation error.
geolocation.on('error', function(error) {
	bondisuy_msgError("Error al obtener la localizaci\u00F3n del dispositivo\n [" + error.message + "]");
});

var accuracyFeature = new ol.Feature();

geolocation.on('change:accuracyGeometry', function() {
	accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
	//removeAllLayers();
});

//Central el mapa en la localizacion actual
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
	/*
		new ol.layer.Tile({
			source: new ol.source.TileWMS({
				url: GEOSERVER,
				params: { 'LAYERS': CAPAS.paradas, 'TILED': true },
				serverType: 'geoserver',
				transition: 0,
				crossOrigin: 'anonymous',
			})
		}),*/
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
	name: 'LocalizacionActual',
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
	var puntos = [];

	for (var lst in list) {

		puntos.push(list[lst]['coordenadas']);

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
		zIndex: 3,
	});

	// Agregamos la capa al mapa
	map.addLayer(capa);

}

var element = document.getElementById('mappopup');

var popup = new ol.Overlay({
	element: element,
	positioning: 'bottom-center',
	stopEvent: false,
	offset: [0, -50],

});

map.addOverlay(popup);


map.on('click', function(evt) {
	var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
		return feature;
	});

	$ds('#mappopup').popover('dispose');

	if (feature) {
		popup.setPosition(feature.getGeometry().getCoordinates());
		var contenido = '';

		if (feature.get('name') != undefined) {
			contenido = feature.get('name');
			$ds('#mappopup').popover('dispose');
		}

		$ds('#mappopup').popover({
			placement: 'top',
			html: true,
			title: 'Informaci\u00F3n',
			content: contenido,
		});

		if (!(feature.get('name') == undefined || feature.get('name') == ""))
			$ds('#mappopup').popover('show');
		feature = undefined;
	} else {
		$ds('#mappopup').popover('dispose');
	}
});

function centerMap(center) {
	map.getView().setCenter(center);
	map.getView().setZoom(ZOOMDEFECTO);
}

function borrarCapaPorNombre(nombre) {
	for (var lay in map.getLayers().getArray()) {
		if (!(lay instanceof ol.layer.Group)) {
			var layer =map.getLayers().getArray()[lay]; 
			
			if(layer.get('name') == nombre){
				map.removeLayer(layer);
			}
		}
	}
}