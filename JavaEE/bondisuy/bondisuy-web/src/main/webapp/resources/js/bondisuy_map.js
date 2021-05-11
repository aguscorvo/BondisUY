
var layers = [
  new ol.layer.Tile({
    source: new ol.source.OSM(),
  }),
  new ol.layer.Tile({
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
	})
 ];

var map = new ol.Map({
  layers: layers,
  target: 'map',
  view: new ol.View({
	center: ol.proj.fromLonLat([-56.179874, -34.861183]),
    zoom: 11,
    minZoom: 11,
    maxZoom: 15,
  }),
});



