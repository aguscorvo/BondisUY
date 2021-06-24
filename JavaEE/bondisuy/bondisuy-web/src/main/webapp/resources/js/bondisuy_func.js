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
						txttable += '<tr data-counter_id=' + recorridos[rec].id + '><td>' + data[td].nombre + '</td><td>' + recorridos[rec].descripcion + '</td></tr>'
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

	if (!(calleName.replace('/\r?\n|\r/g', '') == '' || calleName == 'ALL')) {

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

			borrarCapaPorNombre(L_ESQUINA);
			borrarCapaPorNombre(L_NUEVAPARADA);

			addMarcadores(puntos, L_ESQUINA);

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
					borrarCapaPorNombre(L_NUEVAPARADA);

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

//filtrar Parada por ID
function filtrarParadaById(paradaID) {
	var txttable = '<thead><tr><th>Parada</th><th>Detalle</th></tr></thead><tbody>';
	var table = $ds("#selectTableLineas").children("table").get(0);

	if (paradaID != '') {
		var url = "/bondisuy-web/bondisuyrest/paradas/{PARADA}";

		url = url.replace("{PARADA}", paradaID);


		$ds.ajaxSetup({
			scriptCharset: "utf-8",
			contentType: "application/json; charset=utf-8",
			mimeType: "text/plain",
			headers: { 'Access-Control-Allow-Origin': GEOSERVER }
		});


		$ds.getJSON(url)
			.done(function(data) {

				if (!$ds.isEmptyObject(data)) {
					var cuerpo = data['cuerpo'];
					txttable += '<tr data-counter_id=' + cuerpo.id + '><td>' + cuerpo.id + '</td><td>' + cuerpo.descripcion + '</td></tr>'
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
//Creacion de lineas 
//List de objetos: {descripcion: TEXT, coordenadas: [[lat, long],[lat, long]], color: HEX }
function addRecorridoCercano(list) {
	var txttable = '<thead><tr><th>l&iacute;nea</th><th>detalle</th></tr></thead><tbody>';
	var table = $ds("#selectTableLineas").children("table").get(0);



	for (var rec in list) {
		txttable += '<tr data-counter_id=' + list[rec].id + '><td>' + list[rec].nombre + '</td><td>' + list[rec].descripcion + '</td></tr>'
	}

	txttable += '</tbody>';
	$ds(table).html(txttable);

	//SE agrega la accion de click en la tabla de recorridos
	var recorrido = '';
	var databody = $ds("#selectTableLineas").children("table").get(0);


	$ds(databody).off("click");

	$ds(databody).on('click', 'tr', function() {
		if ($ds(this).hasClass('selected')) {
			$ds(this).removeClass('selected');
		}
		else {
			recorrido = $ds(this).attr('data-counter_id');

			$ds('#selectTableLineas tr.selected').removeClass('selected');
			$ds(this).addClass('selected');

			bondisuy_LoadShow();
			getRecorrido(recorrido);
		}
	});

	$ds('#tab_horas a').on('click', function(e) {
		e.preventDefault()
		$ds(this).tab('show')
	});

	bondisuy_LoadHide();

}

//filtrar linea por Nombre
function getParadaLineaHorario(paradaID) {
	var txttable = '<thead><tr><th></th></thead><tbody><td>';
	var table = $ds("#selectTableLineas").children("table").get(0);

	if (paradaID != '') {
		var url = "/bondisuy-web/bondisuyrest/paradas/{PARADA}/{HORA}";

		var dia = new Date();
		var hora = dia.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })


		url = url.replace("{PARADA}", paradaID).replace("{HORA}", hora);

		console.log(url);

		$ds.ajaxSetup({
			scriptCharset: "utf-8",
			contentType: "application/json; charset=utf-8",
			mimeType: "text/plain",
			headers: { 'Access-Control-Allow-Origin': GEOSERVER }
		});


		$ds.getJSON(url)
			.done(function(data) {

				if (!$ds.isEmptyObject(data)) {
					var lineas = {};
					var cuerpo = data["cuerpo"];

					if (!$ds.isEmptyObject(cuerpo)) {
						var horarios = cuerpo['horarios'];
						for (var lin in horarios) {

							var recorrido = horarios[lin]['recorrido'];
							var nombrelinea = recorrido['linea']['nombre'];
							var linea = {};

							if (lineas[nombrelinea] == undefined) {
								linea['linea'] = recorrido['linea']['nombre'];
								linea['recorrido'] = recorrido['id'];
								linea['detalle'] = recorrido['descripcion'];
								linea['horarios'] = [];

								linea['horarios'].push(horarios[lin]['hora']);
							} else {
								linea = lineas[nombrelinea];

								linea['horarios'].push(horarios[lin]['hora']);

							}

							lineas[nombrelinea] = linea;

						}

					}



				}


				if (lineas.length > 0) {
					txttable += htmlParadaHorarioLinea(lineas);
				} else {
					txttable += 'Sin l\u00EDneas pr\u00F3ximas'
				}


				txttable += '</td></tbody>';

				$ds(table).html(txttable);

				bondisuy_LoadHide();
			})
			.fail(function(jqxhr, textStatus, error) {
				var err = textStatus + ", " + error;
				console.log("Request Failed: " + err + "file: " + url);
			});
	} else {
		txttable += '</td></tbody>';
		$ds(table).html(txttable);

	}

}

//filtrar linea por Nombre
function getParadaLineaTodas(paradaID) {
	var txttable = '<thead><tr><th>l&iacute;nea</th><th>detalle</th></tr></thead><tbody>';
	var table = $ds("#selectTableLineas").children("table").get(0);

	if (paradaID != '') {
		var url = "/bondisuy-web/bondisuyrest/paradas/{PARADA}";

		url = url.replace("{PARADA}", paradaID);

		console.log(url);

		$ds.ajaxSetup({
			scriptCharset: "utf-8",
			contentType: "application/json; charset=utf-8",
			mimeType: "text/plain",
			headers: { 'Access-Control-Allow-Origin': GEOSERVER }
		});


		$ds.getJSON(url)
			.done(function(data) {

				if (!$ds.isEmptyObject(data)) {
					var lineas = {};
					var cuerpo = data["cuerpo"];


					if (!$ds.isEmptyObject(cuerpo)) {
						var horarios = cuerpo['horarios'];
						for (var lin in horarios) {

							var recorrido = horarios[lin]['recorrido'];
							var nombrelinea = recorrido['linea']['nombre'];
							var linea = {};

							if (lineas[nombrelinea] == undefined) {
								linea['linea'] = recorrido['linea']['nombre'];
								linea['recorrido'] = recorrido['id'];
								linea['detalle'] = recorrido['descripcion'];
								linea['horarios'] = [];

								linea['horarios'].push(horarios[lin]['hora']);
							} else {
								linea = lineas[nombrelinea];

								linea['horarios'].push(horarios[lin]['hora']);

							}

							lineas[nombrelinea] = linea;
						}
					}
				}

				var arrVac = Object.keys(lineas);

				for (id in arrVac) {
					var lin = arrVac[id];

					txttable += '<tr data-counter_id=' + lineas[lin].recorrido + '><td>' + lineas[lin].linea + '</td><td>' + lineas[lin].detalle + '</td></tr>'
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
		txttable += '</td></tbody>';
		$ds(table).html(txttable);

	}

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

function htmlParadaHorarioLinea(objlineas) {
	var str = '';
	var hr = '';
	var cont = 0;

	str += '<div id="accordionLinea">';
	for (lin in objlineas) {
		str += '<div class="card">';
		str += '<div class="card-header" id="heading' + objlineas[lin]['linea'] + '">';
		str += '<h5 class="mb-0">';
		str += '<button class="btn" data-toggle="collapse" data-target="#collapse' +
			objlineas[lin]['linea'] + '" aria-expanded="true" aria-controls="collapse' + objlineas[lin]['linea'] + '">';
		str += objlineas[lin]['linea'];
		str += '</button>';
		str += '<h5>';
		str += '</div>';

		str += '<div id="collapse' + objlineas[lin]['linea'] + '" class="collapse' + (cont == 0 ? ' show' : '') +
			'" aria-labelledby="headingOne" data-parent="#accordionLinea">';
		str += '<div class="card-body">';
		str += '<a class="nav-link" href="javascript:viewRecorridoHorario(' + objlineas[lin]['recorrido'] + ')""><i class="mdi mdi-eye"></i> ' + objlineas[lin]['detalle'] + '</a>';
		str += '<ul class="list-group list-group-flush">';

		for (h in objlineas[lin]['horarios']) {
			str += '<li class="list-group-item pl-4">' + objlineas[lin]['horarios'][h] + '</li>';
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

function addRecorridoCercanoNuevaParada(objlineas) {

	var str = '';

	for (lin in objlineas) {
		str += '<option value="' + objlineas[lin]['id'] + '">' + objlineas[lin]['nombre'] + ' - ' + objlineas[lin]['descripcion'] + '</option>';
	}

	$ds("#addNuevaParadaLineasCercanas").html(str);

	$ds('#addParada').modal('show');
}


function addParadaPOSTREST() {
	var url = "/bondisuy-web/bondisuyrest/paradas";
	var nombre = $ds('#addParadaName').val();
	var lineas = $ds('#addNuevaParadaLineasCercanas').val();

	if (nombre.trim() == "") {
		$ds('#errorModalLabel').html('Error');
		$ds('#general_error_icon').html('<h1 ><i class="mdi mdi-alert-outline display-3 text-danger"></i></h1>');
		$ds('#general_error_msj').html('El nombre no puede ser vac\u00EDo');
		$ds('#general_error').modal('show');
	} else {
		if (lineas.length == 0) {
			$ds('#errorModalLabel').html('Error');
			$ds('#general_error_icon').html('<h1 ><i class="mdi mdi-alert-outline display-3 text-danger"></i></h1>');
			$ds('#general_error_msj').html('Debe seleccionar por lo menos una l\u00EDnea');
			$ds('#general_error').modal('show');
		} else {
			$ds('#addParada').modal('hide');
			bondisuy_LoadShow();

			var date = new Date();
			var dd = date.getDate();
			var mm = date.getMonth() + 1;
			var hh = date.getHours();
			var mi = date.getMinutes();

			var ahora = date.getFullYear() + '-' +
				(mm > 9 ? '' : '0') + mm + '-' +
				(dd > 9 ? '' : '0') + dd + ' ' +
				(hh > 9 ? '' : '0') + hh + ':' +
				(mi > 9 ? '' : '0') + mi;

			var point = new Proj4js.Point(coordNuevaParada);   //any object will do as long as it has 'x' and 'y' properties
			var point32721 = Proj4js.transform(proj4326, proj32721, point);      //do the transformation.  x and y are modified in place


			var geom = 'POINT(' + point32721['x'] + ' ' + point32721['y'] + ')';

			var parada = { descripcion: nombre, fecha: ahora, codVia1: 0, codVia2: 0, habilitada: true, geometria: geom };
			const jsParada = JSON.stringify(parada);

			//console.log(jsParada);


			$ds.ajax({
				url: url,
				type: "POST",
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				data: jsParada,
				success: function(result) {
					// when call is sucessfull
					console.log(result)

					var idParada = result['cuerpo']['id'];
					addHorarioParada(idParada, lineas);

				},
				error: function(err) {
					// check the err for error details
					$ds('#errorModalLabel').html('Error');
					$ds('#general_error_icon').html('<h1 ><i class="mdi mdi-alert-outline display-3 text-danger"></i></h1>');
					$ds('#general_error_msj').html(err['responseJSON']['mensaje']);
					$ds('#general_error').modal('show');
				}
			}); // ajax call closing

		}
	}

}

function addHorarioParada(idParada, lineas) {
	var url = "/bondisuy-web/bondisuyrest/paradas/crearHorario";

	for (var p = 0; p < lineas.length; p++) {
		var horario = { hora: "00:00", recorrido: lineas[p], parada: idParada };
		const jsHorario = JSON.stringify(horario);

		$ds.ajax({
			url: url,
			type: "POST",
			dataType: "json",
			contentType: "application/json; charset=utf-8",
			data: jsHorario,
			success: function(result) {
				//console.log(result);
			},
			error: function(err) {
				$ds('#errorModalLabel').html('Error');
				$ds('#general_error_icon').html('<h1 ><i class="mdi mdi-alert-outline display-3 text-danger"></i></h1>');
				$ds('#general_error_msj').html(err['responseJSON']['mensaje']);
				$ds('#general_error').modal('show');
			}
		}); // ajax call closing
	}

	var card = $ds("#to_do_some");
	var form_group = $ds(card).find(".form-group");
	var table = $ds("#selectTableLineas").children("table").get(0);
	$ds(form_group).html('');
	$ds(table).html('');


	getParadasByID(idParada)
	bondisuy_LoadHide();

	$ds('#errorModalLabel').html('Informaci\u00F3n');
	$ds('#general_error_icon').html('<h1 ><i class="mdi mdi-information-outline display-3 text-info" ></i></h1>');
	$ds('#general_error_msj').html('Parada creada con \u00E9xito.');
	$ds('#general_error').modal('show');

}

function getCompanyNuevaLinea() {
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

			$ds("#addLineaEmpresa").html(options);
			$ds('#addLinea').modal('show');

		})
		.fail(function(jqxhr, textStatus, error) {
			var err = textStatus + ", " + error;
			console.log("Request Failed: " + err + "file: " + url);
		});
}

function getRecorridoUPDLinea(idRecorrido) {
	var url = "/bondisuy-web/bondisuyrest/recorridos/{id}";

	url = url.replace('{id}', idRecorrido);

	$ds.ajaxSetup({
		scriptCharset: "utf-8",
		contentType: "application/json; charset=utf-8",
		mimeType: "text/plain",
		headers: { 'Access-Control-Allow-Origin': GEOSERVER }
	});


	$ds.getJSON(url)
		.done(function(data) {
			console.log(data);
			var cuerpo = data['cuerpo'];

			$ds("#updIdRecorrido").val(idRecorrido);
			$ds("#updLineaName").val(cuerpo['linea']['nombre']);
			$ds("#updLineaDescripcion").val(cuerpo['descripcion']);
			$ds("#updLineaEmpresa").val(cuerpo['linea']['compania']['nombre']);
			$ds('#updLinea').modal('show');

		})
		.fail(function(jqxhr, textStatus, error) {
			var err = textStatus + ", " + error;
			console.log("Request Failed: " + err + "file: " + url);
		});
}

function addLineaPOSTREST() {
	var url = "/bondisuy-web/bondisuyrest/lineas";
	var nombre = $ds('#addLineaName').val();
	var descrip = $ds('#addLineaDescripcion').val();
	var empresa = $ds('#addLineaEmpresa').val();


	if (coordNuevaLinea.length == 0) {
		$ds('#errorModalLabel').html('Error');
		$ds('#general_error_icon').html('<h1 ><i class="mdi mdi-alert-outline display-3 text-danger"></i></h1>');
		$ds('#general_error_msj').html('Debe definir una ruta');
		$ds('#general_error').modal('show');
	} else {
		if (nombre.trim() == "") {
			$ds('#errorModalLabel').html('Error');
			$ds('#general_error_icon').html('<h1 ><i class="mdi mdi-alert-outline display-3 text-danger"></i></h1>');
			$ds('#general_error_msj').html('El nombre no puede ser vac\u00EDo');
			$ds('#general_error').modal('show');
		} else {
			if (descrip == "") {
				$ds('#errorModalLabel').html('Error');
				$ds('#general_error_icon').html('<h1 ><i class="mdi mdi-alert-outline display-3 text-danger"></i></h1>');
				$ds('#general_error_msj').html('La descripci\u00F3n no puede ser vac\u00EDa');
				$ds('#general_error').modal('show');
			} else {
				if (empresa == "") {
					$ds('#errorModalLabel').html('Error');
					$ds('#general_error_icon').html('<h1 ><i class="mdi mdi-alert-outline display-3 text-danger"></i></h1>');
					$ds('#general_error_msj').html('Debe seleccionar una empresa');
					$ds('#general_error').modal('show');
				} else {
					$ds('#addLinea').modal('hide');
					bondisuy_LoadShow();

					var linea = { nombre: nombre, origen: 'N/A', destino: 'N/A', compania: empresa };
					const jsLinea = JSON.stringify(linea);

					$ds.ajax({
						url: url,
						type: "POST",
						dataType: "json",
						contentType: "application/json; charset=utf-8",
						data: jsLinea,
						success: function(result) {
							// when call is sucessfull
							if (result['ok'] == true) {
								var idLinea = result['cuerpo']['id'];
								addRecorridoLinea(idLinea, descrip);
							} else {
								$ds('#errorModalLabel').html('Error');
								$ds('#general_error_icon').html('<h1 ><i class="mdi mdi-alert-outline display-3 text-danger"></i></h1>');
								$ds('#general_error_msj').html(result['cuerpo']['mensaje']);
								$ds('#general_error').modal('show');
							}
						},
						error: function(err) {
							// check the err for error details
							console.log(err);
							$ds('#errorModalLabel').html('Error');
							$ds('#general_error_icon').html('<h1 ><i class="mdi mdi-alert-outline display-3 text-danger"></i></h1>');
							$ds('#general_error_msj').html(err['responseJSON']['mensaje']);
							$ds('#general_error').modal('show');
						}
					}); // ajax call closing
				}
			}
		}
	}
}

function addRecorridoLinea(idLinea, descrip) {
	var url = "/bondisuy-web/bondisuyrest/recorridos";

	var date = new Date();
	var dd = date.getDate();
	var mm = date.getMonth() + 1;
	var hh = date.getHours();
	var mi = date.getMinutes();

	var ahora = date.getFullYear() + '-' +
		(mm > 9 ? '' : '0') + mm + '-' +
		(dd > 9 ? '' : '0') + dd + ' ' +
		(hh > 9 ? '' : '0') + hh + ':' +
		(mi > 9 ? '' : '0') + mi;


	var geom = 'LINESTRING(';
	for (var p = 0; p < coordNuevaLinea.length; p++) {
		var point = new Proj4js.Point(coordNuevaLinea[p]);   //any object will do as long as it has 'x' and 'y' properties
		var point32721 = Proj4js.transform(proj4326, proj32721, point);      //do the transformation.  x and y are modified in place

		console.log(point32721);

		geom += point32721['x'] + ' ' + point32721['y'];
		if (p < coordNuevaLinea.length - 1)
			geom += ', ';
	}
	geom += ')'

	var recorrido = { fecha: ahora, descripcion: descrip, activo: true, linea: idLinea, geometria: geom };
	const jsRecorrido = JSON.stringify(recorrido);

	$ds.ajax({
		url: url,
		type: "POST",
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		data: jsRecorrido,
		success: function(result) {
			// when call is sucessfull
			console.log(result)

			var idRecorrido = result['cuerpo']['id'];

			map.removeInteraction(modifyNuevaLinea);
			map.removeInteraction(snapNuevaLinea);

			var card = $ds("#to_do_some");

			var form_group = $ds(card).find(".form-group");
			var table = $ds("#selectTableLineas").children("table").get(0);
			$ds(form_group).html('');
			$ds(table).html('');


			getRecorrido(idRecorrido);
			bondisuy_LoadHide();

			$ds('#errorModalLabel').html('Informaci\u00F3n');
			$ds('#general_error_icon').html('<h1 ><i class="mdi mdi-information-outline display-3 text-info" ></i></h1>');
			$ds('#general_error_msj').html('Linea creada con \u00E9xito.');
			$ds('#general_error').modal('show');
		},
		error: function(err) {
			// check the err for error details
			$ds('#errorModalLabel').html('Error');
			$ds('#general_error_icon').html('<h1 ><i class="mdi mdi-alert-outline display-3 text-danger"></i></h1>');
			$ds('#general_error_msj').html(err['responseJSON']['mensaje']);
			$ds('#general_error').modal('show');
		}
	}); // ajax call closing
}

function updLineaPUTREST() {
	var url = "/bondisuy-web/bondisuyrest/recorridos/editarGeom";
	var idRecorrido = $ds('#updIdRecorrido').val();

	//coordUPDLinea
	if (coordUPDLinea.length == 0) {
		$ds('#errorModalLabel').html('Error');
		$ds('#general_error_icon').html('<h1 ><i class="mdi mdi-alert-outline display-3 text-danger"></i></h1>');
		$ds('#general_error_msj').html('No se realizaron modificaciones');
		$ds('#updLinea').modal('hide');
		$ds('#general_error').modal('show');
	} else {
		$ds('#updLinea').modal('hide');

		var geom = 'LINESTRING(';
		for (var p = 0; p < coordUPDLinea.length; p++) {
			var point = new Proj4js.Point(coordUPDLinea[p]);   //any object will do as long as it has 'x' and 'y' properties
			var point32721 = Proj4js.transform(proj4326, proj32721, point);      //do the transformation.  x and y are modified in place

			geom += point32721['x'] + ' ' + point32721['y'];
			if (p < coordUPDLinea.length - 1)
				geom += ', ';
		}
		geom += ')'

		var recorrido = { id: idRecorrido, geometria: geom };
		const jsRecorrido = JSON.stringify(recorrido);

		$ds.ajax({
			url: url,
			type: "PUT",
			dataType: "json",
			contentType: "application/json; charset=utf-8",
			data: jsRecorrido,
			success: function(result) {
				// when call is sucessfull
				console.log(result)

				for (var f in sourceUPDLinea.getFeatures()) {
					sourceUPDLinea.removeFeature(sourceUPDLinea.getFeatures()[f]);
				}

				map.removeInteraction(snapUPDLinea);

				var card = $ds("#to_do_some");

				var form_group = $ds(card).find(".form-group");
				var table = $ds("#selectTableLineas").children("table").get(0);
				$ds(form_group).html('');
				$ds(table).html('');


				getRecorrido(idRecorrido);
				bondisuy_LoadHide();

				$ds('#errorModalLabel').html('Informaci\u00F3n');
				$ds('#general_error_icon').html('<h1 ><i class="mdi mdi-information-outline display-3 text-info" ></i></h1>');
				$ds('#general_error_msj').html('Linea modificada con \u00E9xito.');
				$ds('#general_error').modal('show');
			},
			error: function(err) {
				// check the err for error details
				$ds('#errorModalLabel').html('Error');
				$ds('#general_error_icon').html('<h1 ><i class="mdi mdi-alert-outline display-3 text-danger"></i></h1>');
				$ds('#general_error_msj').html(err['responseJSON']['mensaje']);
				$ds('#general_error').modal('show');
			}
		}); // ajax call closing	

	}

}

function getRecorridoUPDParada(idParada) {
	var url = "/bondisuy-web/bondisuyrest/paradas/{id}";

	url = url.replace('{id}', idParada);

	$ds.ajaxSetup({
		scriptCharset: "utf-8",
		contentType: "application/json; charset=utf-8",
		mimeType: "text/plain",
		headers: { 'Access-Control-Allow-Origin': GEOSERVER }
	});


	$ds.getJSON(url)
		.done(function(data) {
			console.log(data);
			var cuerpo = data['cuerpo'];

			$ds("#updIdParada").val(idParada);
			$ds("#updParadaDescripcion").val(cuerpo['descripcion']);
			var estado = (cuerpo["habilitada"] ? 'Habilitada' : 'Deshabilitada');
			$ds("#updParadaEstado").val(estado);
			$ds('#updParada').modal('show');

		})
		.fail(function(jqxhr, textStatus, error) {
			var err = textStatus + ", " + error;
			console.log("Request Failed: " + err + "file: " + url);
		});
}



function getZonaLinea() {
	var polygon = coordZonaLinea[0];

	var geom = 'POLYGON((';

	for (var z = 0; z < polygon.length; z++) {
		var point = new Proj4js.Point(polygon[z]);   //any object will do as long as it has 'x' and 'y' properties
		var point32721 = Proj4js.transform(proj4326, proj32721, point);      //do the transformation.  x and y are modified in place

		geom += point32721['x'] + ' ' + point32721['y'];
		if (z < polygon.length - 1)
			geom += ', ';
	}
	geom += '))'

	getRecorridoZona(geom);

}

function changeLineaVER() {
	var tipo = $ds('#changeParadaLinea').val();
	var hora = $ds('#changeTiempoHoras').val();

	if (tipo == 'PAR') {
		getParadasHorario(hora)
	} else if (tipo == 'LIN') {
		getRecorridoHorario(hora);
	}

	$ds('#lastCahange').modal('hide');
}
