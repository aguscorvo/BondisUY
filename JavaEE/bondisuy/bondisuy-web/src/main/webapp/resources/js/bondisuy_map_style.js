


var fillAzul7 = new ol.style.Fill({
	color: 'rgba(0,60,136,0.7)'
});

var fillAzul = new ol.style.Fill({
	color: 'rgba(0,60,136,1)'
});

var fillCeleste = new ol.style.Fill({
	color: 'rgba(51,153,221,1)'
});

var strokeBlanco2 = new ol.style.Stroke({
	color: '#FFFFFF',
	width: 2
});

var strokeBlanco = new ol.style.Stroke({
	color: '#FFFFFF',
	width: 1
});


// Icono Localizacion
var IconLocalizacionStyle = new ol.style.Style({
	image: new ol.style.Icon({
		anchor: [0.5, 0.5],
		anchorXUnits: 'fraction',
		anchorYUnits: 'fraction',
		opacity: 1,
		src: IMAGENES.gps
	}),
});

var styles = [
	new ol.style.Style({
		image: new ol.style.Circle({
			fill: fillAzul7,
			stroke: strokeBlanco,
			radius: 6
		}),
		fill: fillAzul7,
		stroke: strokeBlanco
	}),
		new ol.style.Style({
		image: new ol.style.Circle({
			radius: 4,
			fill: new ol.style.Fill({
				color: '#3399CC',
			}),
			stroke: new ol.style.Stroke({
				color: '#fff',
				width: 2,
			}),
		}),
	})

];