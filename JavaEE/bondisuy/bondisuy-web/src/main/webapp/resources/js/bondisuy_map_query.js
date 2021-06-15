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
					var text = 'Identificador: ' +  prop["id"] +
						'<br>Descripci\u00F3n: ' + prop["descripcion"] +
						'<br>Estado: ' + (prop["habilitada"] ? 'Habilitada' : 'Deshabilitada') +
						"<div id='ver_Lineas_Paradas'><div id='id_parada:_:" + prop["id"] + "'/><a><i class='mdi mdi-eye'></i> Ver pr\u00F3ximas l\u00EDneas </a></div>";

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
			borrarCapaPorNombre(L_NUEVAPARADA);
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
		'&cql_filter=habilitada={habilitado}';
	var paradas = [];

	url = url.replace('{habilitado}', habilitado);

	console.log(url);

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

					var text = 'Identificador: ' + prop["id"] +
						'<br>Descripci\u00F3n: ' + prop["descripcion"] +
						'<br>Estado: ' + (prop["habilitada"] ? 'Habilitada' : 'Deshabilitada') +
						"<div id='ver_Lineas_Paradas'><div id='id_parada:_:" + prop["id"] + "'/><a><i class='mdi mdi-eye'></i> Ver pr\u00F3ximas l\u00EDneas </a></div>";

					//Transformo del sistema EPSG:32721 a EPSG:4326
					var point = new Proj4js.Point(geom["coordinates"]);   //any object will do as long as it has 'x' and 'y' properties
					var point4326 = Proj4js.transform(proj32721, proj4326, point);      //do the transformation.  x and y are modified in place

					var newParada = {
						"descripcion": text,
						"coordenadas": [point4326['x'], point4326['y']],
						"img": (prop["habilitada"] ? IMAGENES.parada : IMAGENES.paradadeshabilitada),
					};

					paradas.push(newParada);

				} catch (e) {
					console.log(prop["cod_parada"]);
					console.log(auxlinea);
				}
			}

			geolocation.setTracking(false);
			borrarCapaPorNombre(L_PARADAS);
			borrarCapaPorNombre(L_RECORRIDOS);
			addMarcadores(paradas, L_PARADAS);
			borrarCapaPorNombre(L_NUEVAPARADA);
			centerMap(coordinates);
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
			borrarCapaPorNombre(L_NUEVAPARADA);
			borrarCapaPorNombre(L_NUEVALINEA);
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

//Funcion que retorna un recorrido cercano
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
			borrarCapaPorNombre(L_NUEVAPARADA);
			addRecorridoCercano(recorridos);

			$ds('#mappopup').popover('dispose');

		})
		.fail(function(jqxhr, textStatus, error) {
			var err = textStatus + ", " + error;
			console.log("Request Failed: " + err + "file: " + url);
		});
}

//Funcion que retorna todas las paradas habilitadas cercanas 
//Parámetros: id: codigo de recorrido
//distancia: distancia en metros
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
					parada['descrip'] = prop['parada_desc'].replace("y", "y<br>").replace("-", "y<br>");

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

						linea['horarios'].push(prop['shora']);

					} else {
						linea = parada['lineas'][prop['linea']];

						linea['horarios'].push(prop['shora']);

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
			borrarCapaPorNombre(L_NUEVAPARADA);
			addMarcadores(recorridos, L_PARADAS);
			bondisuy_LoadHide();

		})
		.fail(function(jqxhr, textStatus, error) {
			var err = textStatus + ", " + error;
			console.log("Request Failed: " + err + "file: " + url);
		});

}

//Funcion que retorna un recorrido cercano
//Parámetros: id: numerico
function getRecorridoCercanosNuevaParada(coord, distancia) {
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
			addRecorridoCercanoNuevaParada(recorridos);

		})
		.fail(function(jqxhr, textStatus, error) {
			var err = textStatus + ", " + error;
			console.log("Request Failed: " + err + "file: " + url);
		});
}

//Funcion que retorna todas las paradas habilitadas cercanas 
//Parámetros: coord: [x,y]
//                      distancia: distancia en metros
function getParadasByID(paradaID) {
	var url = GEOSERVER + '?request=getfeature&version=1.0.0&service=wfs&typename=' + CAPAS.paradas + '&outputformat=json' +
		'&cql_filter=id={ID}';
	var paradas = [];

	url = url.replace('{ID}', paradaID);

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
					var text = 'Identificador: ' +  prop["id"] +
						'<br>Descripci\u00F3n: ' + prop["descripcion"] +
						'<br>Estado: ' + (prop["habilitada"] ? 'Habilitada' : 'Deshabilitada') +
						"<div id='ver_Lineas_Paradas'><div id='id_parada:_:" + prop["id"] + "'/><a><i class='mdi mdi-eye'></i> Ver pr\u00F3ximas l\u00EDneas </a></div>";

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
			borrarCapaPorNombre(L_NUEVAPARADA);
			addMarcadores(paradas, L_PARADAS);

			$ds('#mappopup').popover('dispose');

		})
		.fail(function(jqxhr, textStatus, error) {
			var err = textStatus + ", " + error;
			console.log("Request Failed: " + err + "file: " + url);
		});

}



function htmlParadaHorario(objParada) {
	var str = '';
	var hr = '';
	var cont = 0;
	var objlineas = objParada['lineas'];

	str += '<div>';
	str += '<p>Identificador: ' + objParada['id'] + '<br>' + objParada['descrip'] + '</p>';
	str += '<div>';


	str += '<div id="PopParadaHorario">';
	for (lin in objlineas) {
		str += '<div class="card">';
		str += '<div class="card-header" id="heading' + objlineas[lin]['linea'] + '">';
		str += '<h5 class="mb-0">';
		str += '<button class="btn btn-link" data-toggle="collapse" data-target="#collapse' +
			objlineas[lin]['linea'] + '" aria-expanded="true" aria-controls="collapse' + objlineas[lin]['linea'] + '">';
		str += objlineas[lin]['linea'];
		str += '</button>';
		str += '<h5>';
		str += '</div>';

		str += '<div id="collapse' + objlineas[lin]['linea'] + '" class="collapse' + (cont == 0 ? ' show' : '') +
			'" aria-labelledby="headingOne" data-parent="#PopParadaHorario">';
		str += '<div class="card-body">';
		str += '<p>' + objlineas[lin]['linea'] + '-' + objlineas[lin]['detalle'] + '</p>';
		str += '<ul class="list-group list-group-flush">';

		for (h in objlineas[lin]['horarios']) {
			str += '<li class="list-group-item">' + objlineas[lin]['horarios'][h] + '</li>';
		}
		str += '</ul>';
		str += '</div>';
		str += '</div>';
		str += '</div>';

		cont += 1;

	}

	str += '</div>';

	return str;
}

