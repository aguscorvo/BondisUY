var coordinates = ol.proj.fromLonLat([-56.17938, -34.86157]);
var coordNuevaParada = ol.proj.fromLonLat([-56.17938, -34.86157]);
var projectionSRS = 'EPSG:32721';

var GEOSERVER = '/geoserver/wms';
var DISTANCIA = 500;
var ZOOMDEFECTO = 16;
var ZOOMLINEA = 15;
var MINZOOM = 14; // visible at zoom levels above 14
var MAXZOOM = 11;// visible at zoom levels 14 and below
var L_RECORRIDOS = 'RECORRIDO';
var L_PARADAS = 'PARADAS';
var L_NUEVAPARADA = 'NUEVAPARADA';

var CAPAS = {
	'calles': 'bondisuy:ft_ejes',
	'paradas': 'bondisuy:ft_paradas',
	'lineas': 'bondisuy:ft_lineas',
	'terminales': 'bondisuy:ft_terminales',
	'recorridos': 'bondisuy:ft_recorridolinea',
	'recorridoscercanos': 'bondisuy:ft_lineaubicacion',
	'recorridosparadas': 'bondisuy:ft_recorridoparadas',
};

var FORMATO = {
	'JSON': 'json'
};

var IMAGENES = {
	'parada': '/bondisuy-web/resources/images/map/IconMapBus.png',
	'paradadeshabilitada': '/bondisuy-web/resources/images/map/IconMapBusDes.png',
	'paradanueva': '/bondisuy-web/resources/images/map/IconMapBusNew.png',
	'esquina': '/bondisuy-web/resources/images/map/IconMapCorner.png',
	'direccion': '/bondisuy-web/resources/images/map/IconMapDir.png',
	'gps': '/bondisuy-web/resources/images/map/IconGps.png',
	

};

var COMPANY = {
	'cutcsa': '#314f5f',
	'coetc': '#cc0033',
	'ucot': '#ffBF00',
	'comesa': '#2D572C',
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

var lastFeature;
var lastMarkFeature;

