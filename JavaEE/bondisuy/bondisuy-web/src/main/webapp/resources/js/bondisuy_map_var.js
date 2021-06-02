var coordinates = ol.proj.fromLonLat([-56.17938, -34.86157]);
var projectionSRS = 'EPSG:32721';

//var GEOSERVER = 'http://bondisuy.web.elasticloud.uy/geoserver/wms';
var GEOSERVER = '/geoserver/wms';
//var GEOSERVERIMM = 'http://geoserver.montevideo.gub.uy/geoserver/wms';

var CAPAS = {
	'calles': 'bondisuy:ft_ejes',
	'paradas': 'bondisuy:ft_paradas',
	'lineas': 'bondisuy:ft_lineas',
	'terminales': 'bondisuy:ft_terminales',
	'recorridos': 'bondisuy:ft_recorridolinea'
};

var FORMATO = {
	'JSON': 'json'
};

var DISTANCIA = 500;
var ZOOMDEFECTO = 16;
var ZOOMLINEA = 14;

var IMAGENES = {
	'parada': '/bondisuy-web/resources/images/map/IconMapBus.png',
	'paradadeshabilitada': '/bondisuy-web/resources/images/map/IconMapBusDes.png',
	'esquina': '/bondisuy-web/resources/images/map/IconMapCorner.png',
	'direccion': '/bondisuy-web/resources/images/map/IconMapDir.png',

};

var COMPANY = {
	'cutcsa': '#314f5f',
	'coetc': '#cc0033',
	'ucot': '#fff700',
	'comesa': '#66cc33',
};


// creating source and destination Proj4js objects
// once initialized, these may be re-used as often as needed
var proj4326 = new Proj4js.Proj('EPSG:4326');    //source coordinates will be in Longitude/Latitude
var proj32721 = new Proj4js.Proj('EPSG:32721');     //destination coordinates in LCC, south of France

Proj4js.reportError = function(msg) { alert(msg); }

//Projection 32721
var projection32721 = new ol.proj.Projection({
	code: 'EPSG:32721',
	extent: [441867.78, 1116915.04, 833978.56, 10000000.00],
});

var drawNuevaLocalizacion;
var lastFeature;
var lastMarkFeature;

