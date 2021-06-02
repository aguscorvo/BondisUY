//Listar todas las Empresas
function listarCompany() {
	var options = '<option	value=""></option>';
	var url = "/bondisuy-web/CompanyBondisuy?companyId=ALL";

	$ds.ajaxSetup({
		scriptCharset: "utf-8",
		contentType: "application/json; charset=utf-8",
		mimeType: "text/plain",
		headers: { 'Access-Control-Allow-Origin': GEOSERVER }
	});


	$ds.getJSON(url)
		.done(function(data) {

			for (var op in data) {
				options += '<option	value="' + data[op].id + '">' + data[op].nombre + '</option>'
			}

			$ds("#selectEmpresas").html(options);

		})
		.fail(function(jqxhr, textStatus, error) {
			var err = textStatus + ", " + error;
			console.log("Request Failed: " + err + "file: " + url);
		});

}

//Listar Lineas por Empresa
function filtrarLineaByCompany(companyId) {
	var txttable = '<thead><tr><th>l&iacute;nea</th><th>detalle</th></tr></thead><tbody>';
	var table = $ds("#selectTableLineas").children("table").get(0);

	if (companyId != '' && companyId != null) {
		var url = "/bondisuy-web/LineaBondisuy?companyId=" + companyId;


		$ds.ajaxSetup({
			scriptCharset: "utf-8",
			contentType: "application/json; charset=utf-8",
			mimeType: "text/plain",
			headers: { 'Access-Control-Allow-Origin': GEOSERVER }
		});


		$ds.getJSON(url)
			.done(function(data) {

				for (var td in data) {
					var recorridos = data[td].recorridos;
					for (var rec in recorridos) {
						if (recorridos[rec].activo) {
							txttable += '<tr data-counter_id=' + recorridos[rec].id + '><td>' + data[td].nombre + '</td><td>' + recorridos[rec].descripcion + '</td></tr>'
						}
					}
				}

				txttable += '</tbody>';

				$ds(table).html(txttable);

				bondisuy_LoadHide();
			})
			.fail(function(jqxhr, textStatus, error) {
				var err = textStatus + ", " + error;
				console.log("Request Failed: " + err + "file: " + url);
			});
	} else {
		txttable += '</tbody>';
		$ds(table).html(txttable);

	}
}

//filtrar calle por Nombre
function filtrarCalleByName(calleName) {
	var txttable = '<thead><tr><th>nombre</th><th>tipo</th></tr></thead><tbody>';
	var table = $ds("#selectTableLineas").children("table").get(0);

	if (!(calleName == '' || calleName == 'ALL')) {
		var url = "/bondisuy-web/bondisuyrest/servicios/srchservicio/calle/" + calleName;

		$ds.ajaxSetup({
			scriptCharset: "utf-8",
			contentType: "application/json; charset=utf-8",
			mimeType: "text/plain",
			headers: { 'Access-Control-Allow-Origin': GEOSERVER }
		});


		$ds.getJSON(url)
			.done(function(data) {
				for (var td in data) {
					txttable += '<tr data-counter_id=' + data[td].codigo + '><td>' + data[td].nombre + '</td><td>' + data[td].tipo + '</td></tr>'
				}

				txttable += '</tbody>';

				$ds(table).html(txttable);
			})
			.fail(function(jqxhr, textStatus, error) {
				var err = textStatus + ", " + error;
				console.log("Request Failed: " + err + "file: " + url);
			});
	} else {
		txttable += '</tbody>';
		$ds(table).html(txttable);
	}
}

//getEsquina por ids de calles
function getEsquinaCalle(calle1, calle2, texto) {
	var url = "/bondisuy-web/bondisuyrest/servicios/srchservicio/cruce/" + calle1 + '/' + calle2;
	var puntos = [];

	$ds.ajaxSetup({
		scriptCharset: "utf-8",
		contentType: "application/json; charset=utf-8",
		mimeType: "text/plain",
		headers: { 'Access-Control-Allow-Origin': GEOSERVER }
	});


	$ds.getJSON(url)
		.done(function(data) {

			//Transformo del sistema EPSG:32721 a EPSG:4326
			var point = new Proj4js.Point([data.x, data.y]);   //any object will do as long as it has 'x' and 'y' properties
			var point4326 = Proj4js.transform(proj32721, proj4326, point);      //do the transformation.  x and y are modified in place

			var punto = {
				'descripcion': texto,
				'coordenadas': [point4326['x'], point4326['y']],
				'img': IMAGENES.esquina,
			};

			puntos.push(punto);

			borrarCapaPorNombre('ESQUINA');
			addMarcadores(puntos, 'ESQUINA');

			centerMap([point4326['x'], point4326['y']]);

		})
		.fail(function(jqxhr, textStatus, error) {
			var err = textStatus + ", " + error;
			console.log("Request Failed: " + err + "file: " + url);
		});
}

//getEsquina por ids de calles
function filtrarDireccion(calle, numero, texto) {
	var txttable = '<thead><tr><th>Resultado</th></thead><tbody>';
	var table = $ds("#selectTableLineas").children("table").get(0);


	if (!(numero == '' || numero == 'ALL')) {
		var url = "/bondisuy-web/bondisuyrest/servicios/srchservicio/direccion/" + calle + '/' + numero;
		var puntos = [];

		$ds.ajaxSetup({
			scriptCharset: "utf-8",
			contentType: "application/json; charset=utf-8",
			mimeType: "text/plain",
			headers: { 'Access-Control-Allow-Origin': GEOSERVER }
		});


		$ds.getJSON(url)
			.done(function(data) {

				if (!$ds.isEmptyObject(data)) {
					//Transformo del sistema EPSG:32721 a EPSG:4326
					var point = new Proj4js.Point([data.x, data.y]);   //any object will do as long as it has 'x' and 'y' properties
					var point4326 = Proj4js.transform(proj32721, proj4326, point);      //do the transformation.  x and y are modified in place

					var punto = {
						'descripcion': texto,
						'coordenadas': [point4326['x'], point4326['y']],
						'img': IMAGENES.direccion,
					};

					puntos.push(punto);

					borrarCapaPorNombre('DIRECCION');
					addMarcadores(puntos, 'DIRECCION');

					centerMap([point4326['x'], point4326['y']]);

					txttable += '<tr><td><a class="nav-link"  href="javascript:centerMap([' + point4326['x'] + ', ' + point4326['y'] + ']);">Ver Direcci\u00F3n en mapa</a></td></tr>'

				}

				txttable += '</tbody>';
				$ds(table).html(txttable);
			})
			.fail(function(jqxhr, textStatus, error) {
				var err = textStatus + ", " + error;
				console.log("Request Failed: " + err + "file: " + url);
			});
	} else {
		txttable += '</tbody>';
		$ds(table).html(txttable);
	}

}



//filtrar linea por Nombre
function filtrarLineaByName(lineaName) {
	var txttable = '<thead><tr><th>l&iacute;nea</th><th>Detalle</th></tr></thead><tbody>';
	var table = $ds("#selectTableLineas").children("table").get(0);

	if (lineaName != '') {
		var url = "/bondisuy-web/LineaBondisuy?lineaName=" + lineaName;

		$ds.ajaxSetup({
			scriptCharset: "utf-8",
			contentType: "application/json; charset=utf-8",
			mimeType: "text/plain",
			headers: { 'Access-Control-Allow-Origin': GEOSERVER }
		});


		$ds.getJSON(url)
			.done(function(data) {

				if (!$ds.isEmptyObject(data)) {

					for (var td in data) {
						var recorridos = data[td].recorridos;
						for (var rec in recorridos) {
							if (recorridos[rec].activo) {
								txttable += '<tr data-counter_id=' + recorridos[rec].id + '><td>' + data[td].nombre + '</td><td>' + recorridos[rec].descripcion + '</td></tr>'
							}
						}
					}
				}

				txttable += '</tbody>';

				$ds(table).html(txttable);

				bondisuy_LoadHide();
			})
			.fail(function(jqxhr, textStatus, error) {
				var err = textStatus + ", " + error;
				console.log("Request Failed: " + err + "file: " + url);
			});
	} else {
		txttable += '</tbody>';
		$ds(table).html(txttable);
	}

}

//filtrar calle Esquina por Nombre
function filtrarEsquinaCalle(idCalle, calleName) {
	var txttable = '<thead><tr><th>nombre</th><th>tipo</th></tr></thead><tbody>';
	var table = $ds("#selectTableLineas").children("table").get(0);

	if (calleName == '')
		calleName = 'ALL';

	var url = "/bondisuy-web/bondisuyrest/servicios/srchservicio/cruza/" + idCalle + '/' + calleName;

	$ds.ajaxSetup({
		scriptCharset: "utf-8",
		contentType: "application/json; charset=utf-8",
		mimeType: "text/plain",
		headers: { 'Access-Control-Allow-Origin': GEOSERVER }
	});


	$ds.getJSON(url)
		.done(function(data) {
			for (var td in data) {
				txttable += '<tr data-counter_id=' + data[td].codigo + '><td>' + data[td].nombre + '</td><td>' + data[td].tipo + '</td></tr>'
			}

			txttable += '</tbody>';

			$ds(table).html(txttable);
		})
		.fail(function(jqxhr, textStatus, error) {
			var err = textStatus + ", " + error;
			console.log("Request Failed: " + err + "file: " + url);
		});

}

//Mostrar icono de  espera
function bondisuy_LoadShow() {
	$ds('#general_loader').modal('show');
}

//Ocultar icono de  espera
function bondisuy_LoadHide() {
	$ds('#general_loader').modal('hide');
}


//Mostrar mensaje error
function bondisuy_msgError(message) {
	$ds("#general_error_msj").html(message);
	$ds('#general_error').modal('show');
}
