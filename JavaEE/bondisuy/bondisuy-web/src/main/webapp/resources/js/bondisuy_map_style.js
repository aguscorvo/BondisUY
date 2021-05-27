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
  



var styles = [
   new ol.style.Style({
     image: new ol.style.Circle({
       fill: fillAzul7,
       stroke: strokeBlanco,
       radius: 6
     }),
     fill: fillAzul7,
     stroke: strokeBlanco
   })
 ];