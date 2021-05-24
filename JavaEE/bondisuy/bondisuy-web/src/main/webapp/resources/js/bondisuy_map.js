var coordinates = null;
var GEOSERVER = 'http://bondisuy.web.elasticloud.uy/geoserver/wms';
var GEOSERVERIMM = 'http://geoserver.montevideo.gub.uy/geoserver/wms';
var CAPAS = {
	'calles': 'bondisuy:ft_ejes',
	'paradas': 'stm_paradas',
	'lineas': 'ide:ide_v_uptu_lsv',
	'terminal': 'bondisuy:ft_terminal'
};

/**
 * 
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import {Draw, Modify, Snap} from 'ol/interaction';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
 */








//Capa de Vista
var view = new ol.View({
	center: ol.proj.fromLonLat([-56.17938, -34.86157]),
	zoom: 15,
	minZoom: 11,
	maxZoom: 15,
});
//Fin Capa de Vista


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
			this.getMap().getView().setCenter(coordinates);
			this.getMap().getView().setZoom(15);
		}
	};


	return CenterZoomMapControl;
}(ol.control.Control));
//Fin Agregar boton ir

//Agregar boton corregir ubicacion actual

var sourceNU = new ol.source.Vector({ wrapX: false });

var vectorNU = new ol.layer.Vector({
	source: sourceNU,
});

var drawNU;

function addInteraction() {
	drawNU = new ol.interaction.Draw({
		source: sourceNU,
		type: 'Point',
	});

	drawNU.on('drawend', function(evt) {

		alert("SE TIENE QUE BORRAR EL PUNTO ANTERIOR Y LA GEOLOCALIZACION ACTUAL\nASí como buscar las paradas cercanas");
	});

	map.addInteraction(drawNU);

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
			//this.getMap().getView().setCenter(coordinates);
			//this.getMap().getView().setZoom(15);
			//alert("Dibujar un punto nuevo");
			addInteraction();

		}
	};

	return SetUbicacion;
}(ol.control.Control));
//Fin Agregar Corregir ubicacion





//Fin de definición de capas

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
	//bondisuy_msgError(error.message);
	bondisuy_msgError("Error al obtener la localización del dispositivo\n [" + error.message + "]");
});

var accuracyFeature = new ol.Feature();
geolocation.on('change:accuracyGeometry', function() {
	accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
});



var positionFeature = new ol.Feature();
positionFeature.setStyle(
	new ol.style.Style({
		image: new ol.style.Circle({
			radius: 6,
			fill: new ol.style.Fill({
				color: '#3399CC',
			}),
			stroke: new ol.style.Stroke({
				color: '#fff',
				width: 2,
			}),
		}),
	})
);

//Central el mapa en la localizacion actual
geolocation.on('change:position', function() {
	coordinates = geolocation.getPosition();
	positionFeature.setGeometry(coordinates ? new ol.geom.Point(coordinates) : null);

	//centro el mapa en la geolocalizacion
	var size = map.getSize();
	var x = document.getElementById("map").clientWidth / 2;
	var y = document.getElementById("map").clientHeight / 2;

	view.centerOn(coordinates, size, [x, y]);
});

//Fin de localización actual




//Definicion de capas
var layers = [
	new ol.layer.Tile({
		source: new ol.source.OSM(),
	}),
	vectorNU,
	/*
	new ol.layer.Tile({
		source: new ol.source.TileWMS({
			url: GEOSERVER,
			params: { 'CQL_FILTER': "[cod_nombre=5430]", 'LAYERS': CAPAS.calles, 'TILED': true },
			serverType: 'geoserver',
			transition: 0,
			crossOrigin: 'anonymous',
		})
	}),
	new ol.layer.Tile({
		source: new ol.source.TileWMS({
			url: GEOSERVER,
			params: {  'LAYERS': CAPAS.terminal, 'TILED': true },
			serverType: 'geoserver',
			transition: 0,
			crossOrigin: 'anonymous',
		})
	}),
	new ol.layer.Tile({
		source: new ol.source.TileWMS({
			url: GEOSERVERIMM,
			params: { 'LAYERS': CAPAS.paradas, 'TILED': true },
			serverType: 'geoserver',
			transition: 0,
			crossOrigin: 'anonymous',
		})
	}),
	new ol.layer.Tile({
		source: new ol.source.TileWMS({
			url: GEOSERVERIMM,
			params: { 'LAYERS': CAPAS.lineas, 'TILED': true },
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

var ubicacionactual = new ol.layer.Vector({
	map: map,
	source: new ol.source.Vector({
		features: [accuracyFeature, positionFeature],
	}),
});

geolocation.setTracking(true);
//Fin de modificacion de mapa con ubicación actual

//Se arregla texto del zoom-out
var button = $ds("button.ol-zoom-out");
$ds(button).html("-");


map.on('singleclick', function(evt) {
	//document.getElementById('info').innerHTML = '';

	//	console.log(evt);
	//	console.log(layers[3]);

	//	var viewResolution = /** @type {number} */ (view.getResolution());
	//	var url = layers[3].source.getFeatureInfoUrl(
	//		evt.coordinate,
	//		viewResolution,
	//		'EPSG:32721',
	//		{ 'INFO_FORMAT': 'text/html' }
	//	);
	//	if (url) {
	//		fetch(url)
	//			.then(function(response) { return response.text(); })
	//			.then(function(html) {
	//				console.log(html);
	//			});
	//	}
});

map.on('pointermove', function(evt) {
	if (evt.dragging) {
		return;
	}
	var pixel = map.getEventPixel(evt.originalEvent);
	var hit = map.forEachLayerAtPixel(pixel, function() {
		return true;
	});
	map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});
