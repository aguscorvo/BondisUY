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
			//console.log(data);

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

					if (prop["habilitada"]){
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

			borrarCapaPorNombre('PARADASCERCANAS');
			addMarcadores(paradas, 'PARADASCERCANAS');
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
						"img": '/bondisuy-web/resources/images/map/IconMapBus.png'
					};

					paradas.push(newParada);

				} catch (e) {
					console.log(prop["cod_parada"]);
					console.log(auxlinea);
				}
			}

			borrarCapaPorNombre('ParadasTodas');
			addMarcadores(paradas, 'ParadasTodas');
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
						"img": '/bondisuy-web/resources/images/map/IconMapBus.png'
					};

					paradas.push(newParada);

				} catch (e) {
					console.log(prop["cod_parada"]);
					console.log(auxlinea);
				}
			}

			borrarCapaPorNombre('PARADASESTADO');
			addMarcadores(paradas, 'PARADASESTADO');
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

			borrarCapaPorNombre('RECORRIDO');
			addRecorrido(recorridos, 'RECORRIDO')
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
