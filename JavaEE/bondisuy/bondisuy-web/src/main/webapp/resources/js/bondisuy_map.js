var coordinates = null;

var view = new ol.View({
  center: ol.proj.fromLonLat([-56.17938, -34.86157]),
  zoom: 15,
  minZoom: 13,
  maxZoom: 15,
});

//Agregar boton ir a mi ubicacion actual
var CenterZoomMapControl = (function (Control) {
  function CenterZoomMapControl(opt_options) {
    var options = opt_options || {};

    var button  = document.createElement('button');
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
      if (coordinates != null){
        this.getMap().getView().setCenter(coordinates);
        this.getMap().getView().setZoom(15);
      }
    };


    return CenterZoomMapControl;
  } (ol.control.Control));

  //Definicion de capas
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

  //Usar la locaclizacion actual
  var geolocation = new ol.Geolocation({
    // enableHighAccuracy must be set to true to have the heading value.
    trackingOptions: {
      enableHighAccuracy: true,
    },
    projection: view.getProjection(),
  });

  // handle geolocation error.
  geolocation.on('error', function (error) {
    //bondisuy_msgError(error.message);
    bondisuy_msgError("Error al obtener la localización del dispositivo\n [" + error.message + "]");
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

  //Central el mapa en la localizacion actual
  geolocation.on('change:position', function () {
    coordinates = geolocation.getPosition();
    positionFeature.setGeometry(coordinates ? new ol.geom.Point(coordinates) : null);

    //centro el mapa en la geolocalizacion
    var size = map.getSize();
    var x = document.getElementById("map").clientWidth / 2;
    var y = document.getElementById("map").clientHeight / 2;

    view.centerOn(coordinates, size, [x, y]);
  });


  var map = new ol.Map({
    layers: layers,
    controls: ol.control.defaults().extend([new CenterZoomMapControl()]),
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


//Se arregla texto del zoom-out
var button = $ds("button.ol-zoom-out");
$ds(button).html("-");

