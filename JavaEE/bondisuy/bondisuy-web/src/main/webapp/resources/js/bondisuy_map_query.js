/**
 * 
 */


//Funcion que retorna todas las paradas habilitadas cercanas 
//Parámetros: coord: [x,y]
//                      distancia: distancia en metros
function getParadasCercanas(coord, distancia) {
	var url = GEOSERVER + '?request=getfeature&version=1.0.0&service=wfs&typename=' + CAPAS.paradas + '&outputformat=json' +
		'&cql_filter=DWITHIN(geom,Point({X} {Y}),{DISTANCIA},meters)';
	var paradas = [];

	url = url.replace('{X}', coord[0]).replace('{Y}', coord[1]).replace('{DISTANCIA}', distancia);

	$ds.ajaxSetup({
		scriptCharset: "utf-8",
		contentType: "application/json; charset=utf-8",
		mimeType: "text/plain",
		headers: { 'Access-Control-Allow-Origin': GEOSERVER }
	});

	$ds.getJSON(url)
		.done(function(data) {
			var features = data["features"];
			for (var lin in features) {
				var auxlinea = features[lin];
				var geom = auxlinea["geometry"];
				var prop = auxlinea["properties"];

				try {

					//descripcion: TEXT, coordenadas: [lat, long], img: SRC
					var text = 'Descripci\u00F3n: ' + prop["descripcion"] +
						'<br>Estado: ' + (prop["habilitada"] ? 'Habilitada' : 'Deshabilitada');

					//Transformo del sistema EPSG:32721 a EPSG:4326
					var point = new Proj4js.Point(geom["coordinates"]);   //any object will do as long as it has 'x' and 'y' properties
					var point4326 = Proj4js.transform(proj32721, proj4326, point);      //do the transformation.  x and y are modified in place

					if (prop["habilitada"]) {
						var newParada = {
							"descripcion": text,
							"coordenadas": [point4326['x'], point4326['y']],
							"img": (prop["habilitada"] ? IMAGENES.parada : IMAGENES.paradadeshabilitada),
						};

						paradas.push(newParada);
					}

				} catch (e) {
					console.log(prop["cod_parada"]);
					console.log(auxlinea);
				}
			}

			geolocation.setTracking(false);
			borrarCapaPorNombre(L_PARADAS);
			addMarcadores(paradas, L_PARADAS);
			$ds('#mappopup').popover('dispose');

		})
		.fail(function(jqxhr, textStatus, error) {
			var err = textStatus + ", " + error;
			console.log("Request Failed: " + err + "file: " + url);
		});

}

//Funcion que retorna todas las paradas registradas
function getAllParadas() {
	var url = GEOSERVER + '?request=getfeature&version=1.0.0&service=wfs&typename=' + CAPAS.paradas + "&outputformat=json";
	var paradas = [];

	$ds.ajaxSetup({
		scriptCharset: "utf-8",
		contentType: "application/json; charset=utf-8",
		mimeType: "text/plain",
		headers: { 'Access-Control-Allow-Origin': GEOSERVER }
	});

	$ds.getJSON(url)
		.done(function(data) {

			var features = data["features"];
			for (var lin in features) {
				var auxlinea = features[lin];
				var geom = auxlinea["geometry"];
				var prop = auxlinea["properties"];

				try {

					//descripcion: TEXT, coordenadas: [lat, long], img: SRC

					var text = 'Id Parada: ' + prop["cod_parada"] +
						'<br>Descripci\u00F3n: ' + prop["desc_parada"];

					//Transformo del sistema EPSG:32721 a EPSG:4326
					var point = new Proj4js.Point(geom["coordinates"]);   //any object will do as long as it has 'x' and 'y' properties
					var point4326 = Proj4js.transform(proj32721, proj4326, point);      //do the transformation.  x and y are modified in place

					var newParada = {
						"descripcion": text,
						"coordenadas": [point4326['x'], point4326['y']],
						"img": IMAGENES.parada
					};

					paradas.push(newParada);

				} catch (e) {
					console.log(prop["cod_parada"]);
					console.log(auxlinea);
				}
			}

			geolocation.setTracking(false);
			borrarCapaPorNombre(L_PARADAS);
			addMarcadores(paradas, L_PARADAS);
			$ds('#mappopup').popover('dispose');

		})
		.fail(function(jqxhr, textStatus, error) {
			var err = textStatus + ", " + error;
			console.log("Request Failed: " + err + "file: " + url);
		});
}


//Funcion que retorna todas las paradas registradas
function getAllParadasEstado(habilitado) {
	var url = GEOSERVER + '?request=getfeature&version=1.0.0&service=wfs&typename=' + CAPAS.paradas + "&outputformat=json" +
		'&viewparams=habilitada:{id}';
	var paradas = [];

	$ds.ajaxSetup({
		scriptCharset: "utf-8",
		contentType: "application/json; charset=utf-8",
		mimeType: "text/plain",
		headers: { 'Access-Control-Allow-Origin': GEOSERVER }
	});

	$ds.getJSON(url)
		.done(function(data) {

			var features = data["features"];
			for (var lin in features) {
				var auxlinea = features[lin];
				var geom = auxlinea["geometry"];
				var prop = auxlinea["properties"];

				try {

					//descripcion: TEXT, coordenadas: [lat, long], img: SRC

					var text = 'Id Parada: ' + prop["cod_parada"] +
						'<br>Descripci\u00F3n: ' + prop["desc_parada"];

					//Transformo del sistema EPSG:32721 a EPSG:4326
					var point = new Proj4js.Point(geom["coordinates"]);   //any object will do as long as it has 'x' and 'y' properties
					var point4326 = Proj4js.transform(proj32721, proj4326, point);      //do the transformation.  x and y are modified in place

					var newParada = {
						"descripcion": text,
						"coordenadas": [point4326['x'], point4326['y']],
						"img": IMAGENES.parada
					};

					paradas.push(newParada);

				} catch (e) {
					console.log(prop["cod_parada"]);
					console.log(auxlinea);
				}
			}

			geolocation.setTracking(false);
			borrarCapaPorNombre(L_PARADAS);
			addMarcadores(paradas, L_PARADAS);
			$ds('#mappopup').popover('dispose');

		})
		.fail(function(jqxhr, textStatus, error) {
			var err = textStatus + ", " + error;
			console.log("Request Failed: " + err + "file: " + url);
		});
}


//Funcion que retorna un recorrido por ID
//Parámetros: id: numerico
function getRecorrido(id) {
	var url = GEOSERVER + '?request=getfeature&version=1.0.0&service=wfs&typename=' + CAPAS.recorridos + "&outputformat=json" +
		'&viewparams=recorrido:{id}';
	var recorridos = [];

	url = url.replace('{id}', id);

	$ds.ajaxSetup({
		scriptCharset: "utf-8",
		contentType: "application/json; charset=utf-8",
		mimeType: "text/plain",
		headers: { 'Access-Control-Allow-Origin': GEOSERVER }
	});

	$ds.getJSON(url)
		.done(function(data) {

			var features = data["features"];
			for (var lin in features) {
				var auxlinea = features[lin];
				var geom = auxlinea["geometry"];
				var prop = auxlinea["properties"];
				var coord = [];

				try {

					//descripcion: TEXT, coordenadas: [lat, long], img: SRC

					var text = 'L\u00EDnea: ' + prop["linea_nombre"] +
						'<br>Compa\u00F1\u00EDa: ' + prop["com_nombre"] +
						'<br>Ruta: ' + prop["ruta"];


					for (var co in geom["coordinates"]) {
						//Transformo del sistema EPSG:32721 a EPSG:4326
						var point = new Proj4js.Point(geom["coordinates"][co]);   //any object will do as long as it has 'x' and 'y' properties
						var point4326 = Proj4js.transform(proj32721, proj4326, point);      //do the transformation.  x and y are modified in place

						coord.push([point4326['x'], point4326['y']]);
					}

					var newParada = {
						"descripcion": text,
						"coordenadas": coord,
						"color": COMPANY[prop["com_nombre"].toLowerCase()]
					};

					recorridos.push(newParada);

				} catch (e) {
					console.log(prop["id"]);
					console.log(auxlinea);
				}
			}

			geolocation.setTracking(false);
			borrarCapaPorNombre(L_RECORRIDOS);
			addRecorrido(recorridos, L_RECORRIDOS)
			getRecorridoParada(id, L_PARADAS);
			$ds('#mappopup').popover('dispose');

			var center = parseInt(recorridos[0]['coordenadas'].length / 2);
			centerMapLinea(recorridos[0]['coordenadas'][center]);

		})
		.fail(function(jqxhr, textStatus, error) {
			var err = textStatus + ", " + error;
			console.log("Request Failed: " + err + "file: " + url);
		});
}

//Funcion que retorna un recorrido por ID
//Parámetros: id: numerico
function getRecorridoCercanos(coord, distancia) {
	var url = GEOSERVER + '?request=getfeature&version=1.0.0&service=wfs&typename=' + CAPAS.recorridoscercanos + "&outputformat=json" +
		'&viewparams=X:{X};Y:{Y};distancia:{DISTANCIA}';

	var recorridos = [];

	url = url.replace('{X}', coord[0]).replace('{Y}', coord[1]).replace('{DISTANCIA}', distancia);

	$ds.ajaxSetup({
		scriptCharset: "utf-8",
		contentType: "application/json; charset=utf-8",
		mimeType: "text/plain",
		headers: { 'Access-Control-Allow-Origin': GEOSERVER }
	});

	$ds.getJSON(url)
		.done(function(data) {

			var features = data["features"];
			for (var lin in features) {
				var auxlinea = features[lin];
				var geom = auxlinea["geometry"];
				var prop = auxlinea["properties"];
				var coord = [];

				try {
					var newRecorrido = {
						"descripcion": prop["ruta"],
						"id": prop["id"],
						"nombre": prop["linea_nombre"]
					};

					recorridos.push(newRecorrido);

				} catch (e) {
					console.log(prop["id"]);
					console.log(auxlinea);
				}
			}

			geolocation.setTracking(false);
			borrarCapaPorNombre(L_RECORRIDOS);
			addRecorridoCercano(recorridos);

			$ds('#mappopup').popover('dispose');

		})
		.fail(function(jqxhr, textStatus, error) {
			var err = textStatus + ", " + error;
			console.log("Request Failed: " + err + "file: " + url);
		});
}

//Funcion que retorna todas las paradas habilitadas cercanas 
//Parámetros: coord: [x,y]
//                      distancia: distancia en metros
function getRecorridoParada(id, distancia) {
	var url = GEOSERVER + '?request=getfeature&version=1.0.0&service=wfs&typename=' + CAPAS.recorridosparadas + "&outputformat=json" +
		'&viewparams=recorrido:{RECORRIDO}';

	var paradas = {};
	var recorridos = [];

	url = url.replace('{RECORRIDO}', id);

	$ds.ajaxSetup({
		scriptCharset: "utf-8",
		contentType: "application/json; charset=utf-8",
		mimeType: "text/plain",
		headers: { 'Access-Control-Allow-Origin': GEOSERVER }
	});

	$ds.getJSON(url)
		.done(function(data) {
			var features = data["features"];

			for (var lin in features) {
				var auxlinea = features[lin];
				var geom = auxlinea["geometry"];
				var prop = auxlinea["properties"];
				var parada = {};
				var linea = {};

				if (paradas[prop['parada_id']] == undefined) {
					parada['id'] = prop['parada_id'];
					parada['descrip'] = prop['parada_desc'];

					//Transformo del sistema EPSG:32721 a EPSG:4326
					var point = new Proj4js.Point(geom['coordinates']);   //any object will do as long as it has 'x' and 'y' properties
					var point4326 = Proj4js.transform(proj32721, proj4326, point);      //do the transformation.  x and y are modified in place

					parada['geom'] = [point4326['x'], point4326['y']];
					parada['lineas'] = {};

				} else {
					parada = paradas[prop['parada_id']];
				}

				try {

					if (parada['lineas'][prop['linea']] == undefined) {

						linea['linea'] = prop['linea'];
						linea['detalle'] = prop['detalle'];
						linea['com_nombre'] = prop['com_nombre'];
						linea['horarios'] = [];

						linea['horarios'].push(prop['hora']);

					} else {
						linea = parada['lineas'][prop['linea']];

						linea['horarios'].push(prop['hora']);

					}

					parada['lineas'][prop['linea']] = linea;

					paradas[prop['parada_id']] = parada;

				} catch (e) {
					console.log(prop['parada_id']);
					console.log(e);

				}
			}

			for (obp in paradas) {

				var newParada = {
					"descripcion": htmlParadaHorario(paradas[obp]),
					"coordenadas": paradas[obp]['geom'],
					"img": IMAGENES.parada
				};

				recorridos.push(newParada);
			}

			geolocation.setTracking(false);
			borrarCapaPorNombre(L_PARADAS);
			addMarcadores(recorridos, L_PARADAS);
			bondisuy_LoadHide();

		})
		.fail(function(jqxhr, textStatus, error) {
			var err = textStatus + ", " + error;
			console.log("Request Failed: " + err + "file: " + url);
		});

}

//Funcion que retorna un recorrido por ID
//Parámetros: id: numerico
function setMarca(coord) {
	/*
	<wfs:Transaction service="WFS" version="1.0.0"
  xmlns:wfs="http://www.opengis.net/wfs"
  xmlns:bondisuy="bondisuy"
  xmlns:gml="http://www.opengis.net/gml"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd bondisuy http://bondisuy.web.elasticloud.uy/geoserver/wfs/DescribeFeatureType?typename=bondisuy:ft_paradas">
  <wfs:Insert>
	<bondisuy:ft_paradas>
		<bondisuy:id>6611</bondisuy:id>
		<bondisuy:codvia1>1</bondisuy:codvia1>
		<bondisuy:codvia2>1</bondisuy:codvia2>
		<bondisuy:descripcion>Parada de prueba desde WFS</bondisuy:descripcion>
		<bondisuy:habilitada>true</bondisuy:habilitada>
		<bondisuy:geom>
			<gml:Point srsName="http://www.opengis.net/gml/srs/epsg.xml#32721">
			<gml:coordinates decimal="." cs="," ts=" ">-55.95509,-34.72082</gml:coordinates>
		</gml:Point>
		</bondisuy:geom>
	</bondisuy:ft_paradas>
  </wfs:Insert>
</wfs:Transaction>

	*/

}

function htmlParadaHorario(objParada) {
	var str = '';
	var hr = '';

	str += '<div>';
	str += '<p>' + objParada['descrip'] + '</p>';
	str += '<div>';
	str += '<nav>';
	str += '  <div class="nav nav-tabs" id="nav-tab_horas" role="tablist">';

	for (lin in objParada['lineas']) {
		str += '<a class="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="# ' + objParada['lineas'][lin]['linea'] + '" role="tab" aria-controls="nav-home" aria-selected="true">' + objParada['lineas'][lin]['linea'] + '</a>';
		hr += '<div class="tab-pane fade show active" id=" ' + objParada['lineas'][lin]['linea'] + '" role="tabpanel" aria-labelledby="nav-home-tab">';
		hr += '<ul class="list-group list-group-flush">';

		for (h in objParada['lineas'][lin]['horarios']) {
			hr += '<li class="list-group-item">' + objParada['lineas'][lin]['horarios'][h] + '</li>';
		}
		hr += '</ul>';
		hr += '</div>';

	}

	str += '</div>';
	str += '</nav>';
	str += '<div class="tab-content" id="nav-tabContent">';
	str += hr;
	str += '<div>';
	str += '<div>';
	str += '</div>';

	console.log(str);
	return str;
	/*
	
	<nav>
  <div class="nav nav-tabs" id="nav-tab" role="tablist">
	<a class="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Home</a>
	<a class="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false">Profile</a>
	<a class="nav-item nav-link" id="nav-contact-tab" data-toggle="tab" href="#nav-contact" role="tab" aria-controls="nav-contact" aria-selected="false">Contact</a>
  </div>
</nav>
<div class="tab-content" id="nav-tabContent">
  <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">...</div>
  <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">...</div>
  <div class="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">...</div>
</div>
	*/


}