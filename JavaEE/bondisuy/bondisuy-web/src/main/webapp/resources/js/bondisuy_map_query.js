/**
 * 
 */


//Funcion que retorna todas las paradas cercanas
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
			//console.log(data);

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
						"img": '/bondisuy-web/resources/images/map/IconMapBus.png'
					};

					paradas.push(newParada);

				} catch (e) {
					console.log(prop["cod_parada"]);
					console.log(auxlinea);
				}
			}

			addMarcadores(paradas, 'ParadasTodas');

		})
		.fail(function(jqxhr, textStatus, error) {
			var err = textStatus + ", " + error;
			console.log("Request Failed: " + err + "file: " + url);
		});

}

//Funcion que retorna todas las paradas registradas
function getAllParadas() {
	var url = GEOSERVER + '?request=getfeature&version=1.0.0&service=wfs&typename=' + CAPAS.paradas  + "&outputformat=json";
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
						"img": '/bondisuy-web/resources/images/map/IconMapBus.png'
					};

					paradas.push(newParada);

				} catch (e) {
					console.log(prop["cod_parada"]);
					console.log(auxlinea);
				}
			}

			addMarcadores(paradas, 'ParadasTodas');

		})
		.fail(function(jqxhr, textStatus, error) {
			var err = textStatus + ", " + error;
			console.log("Request Failed: " + err + "file: " + url);
		});
}


function getLineas() {

}
