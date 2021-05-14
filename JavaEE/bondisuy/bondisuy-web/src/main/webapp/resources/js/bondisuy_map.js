var coordinates = null;

var view = new ol.View({
  center: ol.proj.fromLonLat([0, 0]),
    zoom: 15,
    minZoom: 13,
    maxZoom: 15,
});

var centerZoomMap = (function (control){
  function centerZoomMap(opt_options) {
        var options = opt_options || {};

        var span = document.createElement('span');
        span.classList.add("menu-icon");
        span.innerHTML = '<i class="mdi mdi-crosshairs-gps"></i>';

        var element = document.createElement('div');
        element.className = 'centerzoom-map ol-unselectable';
        element.appendChild(span);

        ol.control.Control.call(this, {
          element: element,
          target: options.target
        });
      }

      return centerZoomMap;
}(ol.control.Control));

var layers = [
  new ol.layer.Tile({
    source: new ol.source.OSM(),
  }),
 /* new ol.layer.Tile({
	//extent: [-13884991, 2870341, -7455066, 6338219],
    source: new ol.source.TileWMS({
      url: 'http://192.168.4.88:8082/geoserver/wms',
      params: {'LAYERS': 'tsige:ft_00_departamento', 'TILED': true},
      serverType: 'geoserver',
      // Countries have transparency, so do not fade tiles:
      transition: 0,
	})
	}),
  new ol.layer.Tile({
	//extent: [-13884991, 2870341, -7455066, 6338219],
    source: new ol.source.TileWMS({
      url: 'http://192.168.4.88:8082/geoserver/wms',
      params: {'LAYERS': 'tsige:ft_00_cam_dig', 'TILED': true},
      serverType: 'geoserver',
      // Countries have transparency, so do not fade tiles:
      transition: 0,
	}),
	})*/
 ];

 var geolocation = new ol.Geolocation({
  // enableHighAccuracy must be set to true to have the heading value.
  trackingOptions: {
    enableHighAccuracy: true,
  },
  projection: view.getProjection(),
});

// handle geolocation error.
geolocation.on('error', function (error) {
  msgError(error.message);
});

var accuracyFeature = new ol.Feature();
geolocation.on('change:accuracyGeometry', function () {
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

geolocation.on('change:position', function () {
  coordinates = geolocation.getPosition();
  positionFeature.setGeometry(coordinates ? new ol.geom.Point(coordinates) : null);
 
  //centro el mapa en la geolocalizacion
  var size = map.getSize();
  var x = document.getElementById("map").clientWidth/2;
  var y = document.getElementById("map").clientHeight/2; 

  view.centerOn(coordinates, size, [x, y]);
});


var map = new ol.Map({
  layers: layers,
  target: 'map',
  view: view,
});

new ol.layer.Vector({
  map: map,
  source: new ol.source.Vector({
    features: [accuracyFeature, positionFeature],
  }),
});

geolocation.setTracking(true);





