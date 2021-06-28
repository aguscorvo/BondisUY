var $ds = jQuery.noConflict();
var open_sel = null;
var company = "company";
var line = "line";




/*Select de filtros red_movil_map_filters_accordion*/
$ds(".map_filters_accordion").click(function() {

	if ($ds(open_sel).length) {
		open_sel.slideUp(250);
	}

	var contenido = $ds(this).parent().next(".map_filters_accordion_content");

	if (contenido.css("display") == "none") { //open		
		contenido.slideDown(250);
		open_sel = contenido;
	}
	else { //close		
		contenido.slideUp(250);
		open_sel = null;
	}
});

/*Opcion select */
$ds(".map_filters_accordion_content").on("click", ".map_filters_accordion_counter", function() {
	var oul = $ds(this).parent();
	var odiv = $ds(oul).parent(".map_filters_accordion_content");
	var pdiv = $ds(odiv).parent(".map_filters_select_accordion");
	var odivs = $ds(pdiv).find(".map_filters_accordion_sel");

	switch (odiv.attr("data-counter_type").toLowerCase()) {
		case company:
			filtrarCompany($ds(this).attr("data-counter_id"), $ds(this).html());
			$ds(".map_filters_accordion_sel").each(function(index) {
				var oin = $ds(this).get(0);
				$ds(oin).html("");
			});

			break;
		case line:
			filtrarLinea($ds(this).attr("data-counter_id"));
			break;

		default:

	}

	$ds(odivs.get(0)).html($ds(this).html());
	odiv.slideUp(250);
});

/*Opcion busqueda dropdown */
$ds(".head_search_bar").on("click", "i", function() {
	var odiv = $ds(this).parent();
	var oin = $ds(odiv).children("input").get(0);
	var odivp = $ds(odiv).parent();
	var oli = $ds(odivp).find(".map_filters_accordion_counter");

	$ds(oli).removeClass("d-none");

	oli.each(function(index) {
		if (!$ds(this).html().toUpperCase().includes($ds(oin).val().toUpperCase()) && $ds(oin).val() != "") {
			$ds(this).addClass("d-none");
		}
	});
});

//Select Empresas
$ds("#selectEmpresas").on("change", function() {
	bondisuy_LoadShow();
	filtrarLineaByCompany($ds(this).val());
	//;var size = $ds("#map").height() - 50 - $ds(this).offset().top;
	//$ds("#selectTableLineas").height(size);
});


/*
Función para utilizar en la opción busqueda del menu
Limpia el detalle y arma lo necesario
Parametro: entero con id de opcion
*/
function searchOptions(id) {
	var card = $ds("#to_do_some");
	var card_title = $ds(card).find("h6.card-title");
	var card_subtitle = $ds(card).find("h7.card-title");
	var form_group = $ds(card).find(".form-group");

	var select;

	//buscar linea por empresa
	if (id == 1) {
		cleanInteraction();
		removeAllLayers();

		$ds("a[href='#ui-basic']").click();
		select = '<select class="form-control form-control-sm text-secondary" id="selectEmpresas"></select>';

		$ds(card_title).html("Buscar l&iacute;neas por empresa");
		$ds(card_subtitle).html("L&iacute;nea");
		$ds(form_group).html(select);

		listarCompany();
		filtrarLineaByCompany('');

		//Select Empresas
		$ds("#selectEmpresas").on("change", function() {
			bondisuy_LoadShow();
			filtrarLineaByCompany($ds(this).val());
		});

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


		//Buscar por linea
	} else if (id == 2) {
		cleanInteraction();

		$ds("a[href='#ui-basic']").click();
		select = '<input type="text" class="form-control form-control-sm" id="inputLinea">';
		$ds(card_title).html("Buscar l&iacute;nea");
		$ds(card_subtitle).html("L&iacute;nea");
		$ds(form_group).html(select);

		filtrarLineaByName('');

		var nombre;
		//Input Linea
		$ds("#inputLinea").on("keypress", function(ev) {
			switch (ev.which) {
				case 8: // Backspace
				case 9: // Tab
				case 13: // Enter
				case 37: // Left
				case 38: // Up
				case 39: // Right
				case 40: // Down
				default:
					nombre = $ds(this).val() + String.fromCharCode(ev.which);
			}
			//bondisuy_LoadShow();
			filtrarLineaByName(nombre);
			//var size = $ds("#map").height() - 50 - $ds(this).offset().top;
			//$ds("#selectTableLineas").height(size);
		});

		$ds("#inputLinea").on("keydown", function(ev) {
			switch (ev.which) {
				case 8: // Backspace
				case 9: // Tab
				case 13: // Enter
				case 37: // Left
				case 38: // Up
				case 39: // Right
				case 40: // Down
				default:
					nombre = $ds(this).val() + String.fromCharCode(ev.which);
			}
			//bondisuy_LoadShow();
			filtrarLineaByName(nombre);
			//var size = $ds("#map").height() - 50 - $ds(this).offset().top;
			//$ds("#selectTableLineas").height(size);
		});

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

				//bondisuy_LoadShow();
				getRecorrido(recorrido);
			}
		});

		//Buscar Esquina
	} else if (id == 3) {
		cleanInteraction();
		removeAllLayers();


		$ds("a[href='#ui-basic']").click();
		select = '<label for="inputCalleA">Calle</label><input type="text" class="form-control form-control-sm" id="inputCalleA">';
		select += '<label for="inputCalleB">Esquina</label><input type="text" class="form-control form-control-sm" id="inputCalleB" disabled>';
		$ds(card_title).html("Buscar Esquina");
		$ds(card_subtitle).html("Seleccione Calle");
		$ds(form_group).html(select);

		filtrarCalleByName('');
		var nombre;
		var nombreb;
		var calle = '';
		var calleb = '';

		//Input Linea
		$ds("#inputCalleA").on("keypress", function(ev) {
			calle = '';
			calleb = '';
			$ds('#inputCalleB').prop("disabled", true);
			$ds('#inputCalleB').val('');

			switch (ev.which) {
				case 8: // Backspace
					nombre = $ds(this).val();
					break;
				case 9: // Tab
				case 13: // Enter
					nombre = $ds(this).val();
					break;
				case 16: // Shift
				case 37: // Left
				case 38: // Up
				case 39: // Right
				case 40: // Down
				default:
					nombre = $ds(this).val() + String.fromCharCode(ev.which);
			}
			if (nombre != '') {
				nombre = nombre.replace(/ /gi, '+');
			} else {
				nombre = 'ALL';
			}

			filtrarCalleByName(nombre);
		});

		$ds("#inputCalleA").on("keydown", function(ev) {
			calle = '';
			calleb = '';
			$ds('#inputCalleB').prop("disabled", true);
			$ds('#inputCalleB').val('');

			switch (ev.which) {
				case 8: // Backspace
					nombre = $ds(this).val();
					break;
				case 9: // Tab
				case 13: // Enter
					nombre = $ds(this).val();
					break;
				case 16: // Shift
				case 37: // Left
				case 38: // Up
				case 39: // Right
				case 40: // Down
				default:
					nombre = $ds(this).val() + String.fromCharCode(ev.which);
			}

			if (nombre != '') {
				nombre = nombre.replace(/ /gi, '+');
			} else {
				nombre = 'ALL';
			}

			filtrarCalleByName(nombre);
		});

		//Input CalleB
		$ds("#inputCalleB").on("keypress", function(ev) {

			switch (ev.which) {
				case 8: // Backspace
					nombreb = $ds(this).val();
					break;
				case 9: // Tab
				case 13: // Enter
					nombreb = $ds(this).val();
					break;
				case 16: // Shift
				case 37: // Left
				case 38: // Up
				case 39: // Right
				case 40: // Down
				default:
					nombreb = $ds(this).val() + String.fromCharCode(ev.which);
			}
			if (nombreb != '') {
				nombreb = nombreb.replace(/ /gi, '+');
			} else {
				nombreb = 'ALL';
			}


			filtrarEsquinaCalle(calle, nombreb);
		});

		$ds("#inputCalleB").on("keydown", function(ev) {

			switch (ev.which) {
				case 8: // Backspace
					nombreb = $ds(this).val();
					break;
				case 9: // Tab
				case 13: // Enter
					nombreb = $ds(this).val();
					break;
				case 16: // Shift
				case 37: // Left
				case 38: // Up
				case 39: // Right
				case 40: // Down
				default:
					nombreb = $ds(this).val() + String.fromCharCode(ev.which);
			}

			if (nombreb != '') {
				nombreb = nombreb.replace(/ /gi, '+');
			} else {
				nombreb = 'ALL';
			}

			filtrarEsquinaCalle(calle, nombreb);

		});

		var databody = $ds("#selectTableLineas").children("table").get(0);

		$ds(databody).off("click");

		$ds(databody).on('click', 'tr', function() {
			if ($ds(this).hasClass('selected')) {
				$ds(this).removeClass('selected');
			}
			else {
				$ds('#selectTableLineas tr.selected').removeClass('selected');
				$ds(this).addClass('selected');
				var otd = $ds(this).children('td').get(0);

				if (calle == '') {
					$ds("#inputCalleA").val($ds(otd).html());
					calle = $ds(this).attr('data-counter_id');

					$ds('#inputCalleB').prop("disabled", false);
					filtrarEsquinaCalle(calle, '');

				} else if (calle != '') {
					calleb = $ds(this).attr('data-counter_id');
					$ds("#inputCalleB").val($ds(otd).html());

					let texto = $ds("#inputCalleA").val() + ' y ' + $ds(otd).html();

					getEsquinaCalle(calle, calleb, texto);
				}
			}
		});
		//Buscar direccion
	} else if (id == 4) {
		cleanInteraction();
		removeAllLayers();

		$ds("a[href='#ui-basic']").click();
		select = '<label for="inputCalleN">Calle</label><input type="text" class="form-control form-control-sm" id="inputCalleN">';
		select += '<label for="inputNumero">N\u00FAmero</label><input type="number" class="form-control form-control-sm" id="inputNumero" disabled>';
		$ds(card_title).html("Buscar Direcci\u00F3n");
		$ds(card_subtitle).html("Seleccione Calle");
		$ds(form_group).html(select);

		filtrarCalleByName('');
		var nombre;
		var calle = '';
		var numero = '';
		var texto = ';'

		//Input Calle
		$ds("#inputCalleN").on("keypress", function(ev) {
			calle = '';
			numero = '';
			$ds('#inputNumero').prop("disabled", true);
			$ds('#inputNumero').val('');

			switch (ev.which) {
				case 8: // Backspace
					nombre = $ds(this).val();
					break;
				case 9: // Tab
				case 13: // Enter
				case 16: // Shift
				case 37: // Left
				case 38: // Up
				case 39: // Right
				case 40: // Down
				default:
					nombre = $ds(this).val() + String.fromCharCode(ev.which);
			}
			if (nombre != '') {
				nombre = nombre.replace(/ /gi, '+');
			} else {
				nombre = 'ALL';
			}

			filtrarCalleByName(nombre);
			var size = $ds("#map").height() - 80 - $ds(this).offset().top;
			$ds("#selectTableLineas").height(size);
		});

		$ds("#inputCalleN").on("keydown", function(ev) {
			calle = '';
			numero = '';
			$ds('#inputNumero').prop("disabled", true);
			$ds('#inputNumero').val('');

			switch (ev.which) {
				case 8: // Backspace
					nombre = $ds(this).val();
					break;
				case 9: // Tab
				case 13: // Enter
				case 16: // Shift
				case 37: // Left
				case 38: // Up
				case 39: // Right
				case 40: // Down
				default:
					nombre = $ds(this).val() + String.fromCharCode(ev.which);
			}
			if (nombre != '') {
				nombre = nombre.replace(/ /gi, '+');
			} else {
				nombre = 'ALL';
			}

			filtrarCalleByName(nombre);
			var size = $ds("#map").height() - 80 - $ds(this).offset().top;
			$ds("#selectTableLineas").height(size);
		});

		//Input Numero
		$ds("#inputNumero").on("keypress", function(ev) {
			numero = '';

			switch (ev.which) {
				case 8: // Backspace
					numero = $ds(this).val();
					break;
				case 9: // Tab
				case 13: // Enter
				case 16: // Shift
				case 37: // Left
				case 38: // Up
				case 39: // Right
				case 40: // Down
				default:
					numero = $ds(this).val() + String.fromCharCode(ev.which);
			}
			if (numero != '') {
				numero = numero.replace(/ /gi, '+');
			} else {
				numero = 'ALL';
			}

			texto = $ds("#inputCalleN").val() + ' ' + numero;
			filtrarDireccion(calle, numero, texto);

			var size = $ds("#map").height() - 80 - $ds(this).offset().top;
			$ds("#selectTableLineas").height(size);
		});

		$ds("#inputNumero").on("keydown", function(ev) {
			numero = '';

			switch (ev.which) {
				case 8: // Backspace
					numero = $ds(this).val();
					break;
				case 9: // Tab
				case 13: // Enter
				case 16: // Shift
				case 37: // Left
				case 38: // Up
				case 39: // Right
				case 40: // Down
				default:
					numero = $ds(this).val() + String.fromCharCode(ev.which);
			}
			if (numero != '') {
				numero = numero.replace(/ /gi, '+');
			} else {
				numero = 'ALL';
			}

			texto = $ds("#inputCalleN").val() + ' ' + numero;
			filtrarDireccion(calle, numero, texto);

			var size = $ds("#map").height() - 80 - $ds(this).offset().top;
			$ds("#selectTableLineas").height(size);
		});

		var databody = $ds("#selectTableLineas").children("table").get(0);

		$ds(databody).off("click");

		$ds(databody).on('click', 'tr', function() {
			if ($ds(this).hasClass('selected')) {
				$ds(this).removeClass('selected');
			}
			else {
				$ds('#selectTableLineas tr.selected').removeClass('selected');
				$ds(this).addClass('selected');
				var otd = $ds(this).children('td').get(0);

				if (calle == '') {
					$ds("#inputCalleN").val($ds(otd).html());

					calle = $ds(this).attr('data-counter_id');
					$ds('#inputNumero').prop("disabled", false);
				}
			}
		});

		//Ver paradas habilitadas
	} else if (id == 5) {
		cleanInteraction();
		removeAllLayers();

		var card = $ds("#to_do_some");

		$ds("a[href='#ui-basic']").click();
		$ds(card_title).html("Ver Paradas Habilitadas");
		$ds(card_subtitle).html("Informaci\u00F3n");
		var form_group = $ds(card).find(".form-group");
		var table = $ds("#selectTableLineas").children("table").get(0);

		$ds(form_group).html("");
		$ds(table).html('');

		$ds(table).off("click");

		getAllParadasEstado(true);


		//Ver paradas deshabilitadas
	} else if (id == 6) {
		cleanInteraction();
		removeAllLayers();

		var card = $ds("#to_do_some");

		$ds("a[href='#ui-basic']").click();
		$ds(card_title).html("Ver Paradas Habilitadas");
		$ds(card_subtitle).html("Informaci\u00F3n");
		var form_group = $ds(card).find(".form-group");
		var table = $ds("#selectTableLineas").children("table").get(0);

		$ds(form_group).html("");
		$ds(table).html('');

		$ds(table).off("click");

		getAllParadasEstado(false);

		//veer lineas cercanas
	} else if (id == 7) {
		cleanInteraction();
		//removeAllLayers();

		var card = $ds("#to_do_some");
		var table = $ds("#selectTableLineas").children("table").get(0);
		$ds("a[href='#ui-basic']").click();

		var card_title = $ds(card).find("h6.card-title");
		var card_subtitle = $ds(card).find("h7.card-title");
		var form_group = $ds(card).find(".form-group");

		$ds(card_title).html("L&iacute;neas cercanas");
		$ds(card_subtitle).html("");
		$ds(form_group).html("");

		var point = new Proj4js.Point(coordinates);   //any object will do as long as it has 'x' and 'y' properties
		var point32721 = Proj4js.transform(proj4326, proj32721, point);      //do the transformation.  x and y are modified in place

		getRecorridoCercanos([point32721['x'], point32721['y']], DISTANCIA);
		var txttable = '<thead><tr><th>l&iacute;nea</th><th>Detalle</th></tr></thead><tbody></tbody>';

		$ds(table).html(txttable);

		//Nueva Parada
	} else if (id == 8) {
		cleanInteraction();
		removeAllLayers();

		var card = $ds("#to_do_some");
		var button = '<button class="btn btn-secondary btn-fw" id="confNuevaParada">Confirmar Ubicaci\u00F3n</select>';

		$ds("a[href='#ui-busstop']").click();
		$ds(card_title).html("Crear Parada");
		$ds(card_subtitle).html("");
		var form_group = $ds(card).find(".form-group");
		var table = $ds("#selectTableLineas").children("table").get(0);

		$ds(form_group).html(button);
		$ds(table).html('');

		$ds(table).off("click");

		addParada();

		var buttonConf = $ds("#confNuevaParada");

		$ds(buttonConf).off("click");

		$ds(buttonConf).on('click', function() {
			var point = new Proj4js.Point(coordNuevaParada);   //any object will do as long as it has 'x' and 'y' properties
			var point32721 = Proj4js.transform(proj4326, proj32721, point);      //do the transformation.  x and y are modified in place

			getRecorridoCercanosNuevaParada([point32721['x'], point32721['y']], DISTANCIA_LINEAPARADA);

		});

		//modificar parada
	} else if (id == 9) {
		cleanInteraction();
		removeAllLayers();

		lineasParadasHorario = {};
		updLineasParadasHorario = {};
		updParadaGeo = false;
		updParadaERROR = false;
		updParadaERRORtxt = '';

		$ds("a[href='#ui-busstop']").click();
		select = '<input type="text" class="form-control form-control-sm" id="inputEditParada"><br>';
		var button = '<button class="btn btn-secondary btn-fw" id="confUpdParada">Modificar</select>';
		$ds(card_title).html("Modificar Parada");
		$ds(card_subtitle).html("Parada");
		$ds(form_group).html(select + button);

		filtrarParadaById('');

		var nombre;
		//Input Linea
		$ds("#inputEditParada").on("keypress", function(ev) {
			switch (ev.which) {
				case 8: // Backspace
					nombre = $ds(this).val();
					break;
				case 9: // Tab
				case 13: // Enter
				case 37: // Left
				case 38: // Up
				case 39: // Right
				case 40: // Down
				default:
					nombre = $ds(this).val() + String.fromCharCode(ev.which);
			}
			filtrarParadaById(nombre);
		});

		$ds("#inputEditParada").on("keydown", function(ev) {
			switch (ev.which) {
				case 8: // Backspace
					nombre = $ds(this).val();
					break;
				case 9: // Tab
				case 13: // Enter
				case 37: // Left
				case 38: // Up
				case 39: // Right
				case 40: // Down
				default:
					nombre = $ds(this).val() + String.fromCharCode(ev.which);
			}
			filtrarParadaById(nombre);
		});

		var updparada = '';
		var databody = $ds("#selectTableLineas").children("table").get(0);
		var tablaUPDParadasHorasLista = $ds("#UPDParadasHorasLista").children("table").get(0);
		var tablaBody = $ds(tablaUPDParadasHorasLista).children("tbody");

		var txttablec = '';



		$ds(databody).off("click");

		$ds(databody).on('click', 'tr', function() {
			if ($ds(this).hasClass('selected')) {
				$ds(this).removeClass('selected');
			}
			else {
				updparada = $ds(this).attr('data-counter_id');

				$ds('#selectTableLineas tr.selected').removeClass('selected');
				$ds(this).addClass('selected');

				updOBJParadaName = $ds(this).find("td").eq(1).html();

				//bondisuy_LoadShow();
				getUPDParada(updparada);
			}
		});

		var buttonConf = $ds("#confUpdParada");

		$ds(buttonConf).off("click");

		$ds(buttonConf).on('click', function() {
			var point = new Proj4js.Point(coordUPDParada);   //any object will do as long as it has 'x' and 'y' properties
			var point32721 = Proj4js.transform(proj4326, proj32721, point);      //do the transformation.  x and y are modified in place

			getRecorridoUPDParada(updparada, [point32721['x'], point32721['y']], DISTANCIA_LINEAPARADA);
			$ds(tablaBody).empty();

		});

		var updparada = '';
		var updparadaLinea = '';
		var updparadaLineaNombre = '';
		var databodyasociada = $ds("#selectTableAsociadaLineas").children("table").get(0);

		$ds(databodyasociada).off("click");

		$ds(databodyasociada).on('click', 'tr', function() {
			if ($ds(this).hasClass('selected')) {
				$ds(this).removeClass('selected');
				$ds('#selectTableCercanaLineas tr.selected').removeClass('selected');
			}
			else {
				$ds('#selectTableAsociadaLineas tr.selected').removeClass('selected');
				$ds(this).addClass('selected');

				$ds('#updIdParadaHora').val(updparada);
				$ds('#updIdParadaLineaHora').val($ds(this).attr('data-counter_id'));
				$ds('#updParadaLineaDescripcion').val($ds(this).find("td").eq(0).html() + '-' + $ds(this).find("td").eq(1).html());

				updparadaLinea = $ds(this).attr('data-counter_id');
				updparadaLineaNombre = $ds(this).find("td").eq(0).html();
			}
		});

		var databodycercana = $ds("#selectTableCercanaLineas").children("table").get(0);


		$ds(databodycercana).off("click");

		$ds(databodycercana).on('click', 'tr', function() {
			if ($ds(this).hasClass('selected')) {
				$ds(this).removeClass('selected');
				$ds('#selectTableAsociadaLineas tr.selected').removeClass('selected');
			}
			else {
				$ds('#selectTableCercanaLineas tr.selected').removeClass('selected');
				$ds(this).addClass('selected');

				$ds('#updIdParadaHora').val(updparada);
				$ds('#updIdParadaLineaHora').val($ds(this).attr('data-counter_id'));
				$ds('#updParadaLineaDescripcion').val($ds(this).find("td").eq(0).html() + '-' + $ds(this).find("td").eq(1).html());

				updparadaLinea = $ds(this).attr('data-counter_id');
				updparadaLineaNombre = $ds(this).find("td").eq(0).html();
			}
		});

		var tablaUPDParadasHorasLista = $ds("#UPDParadasHorasLista").children("table").get(0);
		var tablaBody = $ds(tablaUPDParadasHorasLista).children("tbody");

		var txttablec = '';

		var buttonViewHorario = $ds("#updParadaHorarioButton");

		$ds(buttonViewHorario).on('click', function() {

			if (lineasParadasHorario.hasOwnProperty(updparadaLinea)) {
				var lineaUPDHorarios = lineasParadasHorario[updparadaLinea]['horarios'];

				var existeLineaenTabla = $ds(tablaBody).find('[data-counter_id="' + updparadaLinea + '"]');

				console.log(existeLineaenTabla.length);

				if (existeLineaenTabla.length == 0) {
					for (var h in lineaUPDHorarios) {
						txttablec = '<tr data-counter_id="' + updparadaLinea + '" data-counter_exist= "T" data-counter_eliminar="F" data-counter_hora="' + lineaUPDHorarios[h] + '"><td>' + updparada + '</td><td>' + updparadaLineaNombre + '</td><td>' + lineaUPDHorarios[h] + '</td></tr>';
						tablaBody.append(txttablec);
					}
				}

			}

			$ds('#updParada').modal('hide');
			$ds('#updParadaHorario').modal('show');
		});

		$ds('#closeModalUPDParadaHora').on('click', function() {
			$ds('#updParada').modal('show');
		});

		$ds("#updParadaHoraADD").on('click', function() {
			if ($ds('#updParadaHora').val().trim() != '') {
				txttablec = '<tr data-counter_id="' + updparadaLinea + '" data-counter_exist= "F"  data-counter_eliminar="F" data-counter_hora="' + $ds('#updParadaHora').val() + '"><td>' + updparada + '</td><td>' + updparadaLineaNombre + '</td><td>' + $ds('#updParadaHora').val() + '</td></tr>';
				tablaBody.append(txttablec);
			}
		});

		$ds(tablaUPDParadasHorasLista).off("click");
		var objRowHora;

		$ds(tablaUPDParadasHorasLista).on('click', 'tr', function() {
			if ($ds(this).hasClass('selected')) {
				$ds(this).removeClass('selected');
			}
			else {
				$ds('#UPDParadasHorasLista tr.selected').removeClass('selected');
				$ds(this).addClass('selected');

				objRowHora = this;

			}
		});

		$ds("#updParadaHoraDEL").on('click', function() {

			$ds(objRowHora).attr("data-counter_eliminar", "T");;
			$ds(objRowHora).hide();
		});


		$ds("#buttonUPDParadaREST").on('click', function() {
			var listaEliminarHorario = [];
			var listaInsertarHorario = [];

			$ds('#UPDParadasHorasLista tr').each(function() {

				if ($ds(this).attr("data-counter_exist") == 'F' && $ds(this).attr("data-counter_eliminar") == 'F') {
					var horario = {};
					horario['linea'] = $ds(this).attr("data-counter_id");
					horario['parada'] = updparada;
					horario['horario'] = $ds(this).attr("data-counter_hora");

					listaInsertarHorario.push(horario);
				} else if ($ds(this).attr("data-counter_exist") == 'T' && $ds(this).attr("data-counter_eliminar") == 'F') {
					var horario = {};
					horario['linea'] = $ds(this).attr("data-counter_id");
					horario['parada'] = updparada;
					horario['horario'] = $ds(this).attr("data-counter_hora");

					listaInsertarHorario.push(horario);

					if (listaEliminarHorario.indexOf($ds(this).attr("data-counter_id")) == -1)
						listaEliminarHorario.push($ds(this).attr("data-counter_id"));
				}
			});


//			console.log(listaEliminarHorario);
//			console.log(listaInsertarHorario);
//			console.log(updParadaGeo);

			if (updParadaGeo)
				addHorarioLineaRecorridoGEOM(updparada);

			updParadaREST(listaEliminarHorario, listaInsertarHorario, updparada);

			console.log(updParadaERROR);
			if (!updParadaERROR) {
				$ds(tablaBody).empty();

				$ds('#updParada').modal('hide');
				$ds('#errorModalLabel').html('Informaci\u00F3n');
				$ds('#general_error_icon').html('<h1 ><i class="mdi mdi-information-outline display-3 text-info" ></i></h1>');
				$ds('#general_error_msj').html('Parada modificada con \u00E9xito.');
				$ds('#general_error').modal('show');

				getParadasByID(updparada);

			} else {
				$ds(tablaBody).empty();

				$ds('#errorModalLabel').html('Error');
				$ds('#general_error_icon').html('<h1 ><i class="mdi mdi-alert-outline display-3 text-danger"></i></h1>');
				$ds('#general_error_msj').html(updParadaERRORtxt);
				$ds('#general_error').modal('show');

			}


		});


		//nueva linea
	} else if (id == 10) {
		cleanInteraction();
		removeAllLayers();

		var card = $ds("#to_do_some");
		var button = '<button class="btn btn-secondary btn-fw" id="confNuevaLinea">Confirmar L\u00EDnea</select>';

		$ds("a[href='#ui-busline']").click();
		$ds(card_title).html("Crear Linea");
		$ds(card_subtitle).html("");
		var form_group = $ds(card).find(".form-group");
		var table = $ds("#selectTableLineas").children("table").get(0);

		$ds(form_group).html(button);
		$ds(table).html('');

		$ds(table).off("click");

		removeAllLayers();

		addLinea();

		var buttonConf = $ds("#confNuevaLinea");

		$ds(buttonConf).off("click");


		$ds(buttonConf).on('click', function() {

			getCompanyNuevaLinea();

		});


		//modificar linea
	} else if (id == 11) {
		cleanInteraction();
		removeAllLayers();

		$ds("a[href='#ui-busline']").click();
		select = '<input type="text" class="form-control form-control-sm" id="inputLinea"><br>';
		var button = '<button class="btn btn-secondary btn-fw" id="confUpdLinea">Modificar</select>';
		$ds(card_title).html("Modificar l&iacute;nea");
		$ds(card_subtitle).html("L&iacute;nea");
		$ds(form_group).html(select + button);

		filtrarLineaByName('');

		var nombre;
		//Input Linea
		$ds("#inputLinea").on("keypress", function(ev) {
			switch (ev.which) {
				case 8: // Backspace
					nombre = $ds(this).val();
					break;
				case 9: // Tab
				case 13: // Enter
				case 37: // Left
				case 38: // Up
				case 39: // Right
				case 40: // Down
				default:
					nombre = $ds(this).val() + String.fromCharCode(ev.which);
			}
			filtrarLineaByName(nombre);
		});

		$ds("#inputLinea").on("keydown", function(ev) {
			switch (ev.which) {
				case 8: // Backspace
					nombre = $ds(this).val();
					break;
				case 9: // Tab
				case 13: // Enter
				case 37: // Left
				case 38: // Up
				case 39: // Right
				case 40: // Down
				default:
					nombre = $ds(this).val() + String.fromCharCode(ev.which);
			}
			filtrarLineaByName(nombre);
		});

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

				//bondisuy_LoadShow();
				getUPDRecorrido(recorrido);
			}
		});

		var buttonConf = $ds("#confUpdLinea");

		$ds(buttonConf).off("click");

		$ds(buttonConf).on('click', function() {

			getRecorridoUPDLinea(recorrido);

		});



		//ver paradas cercanas
	} else if (id == 12) {
		cleanInteraction();
		removeAllLayers();

		$ds("a[href='#ui-basic']").click();
		var form_group = $ds(card).find(".form-group");
		var table = $ds("#selectTableLineas").children("table").get(0);

		$ds(form_group).html('');
		$ds(table).html('');


		var point = new Proj4js.Point(coordinates);   //any object will do as long as it has 'x' and 'y' properties
		var point32721 = Proj4js.transform(proj4326, proj32721, point);      //do the transformation.  x and y are modified in place

		getParadasCercanas([point32721['x'], point32721['y']], DISTANCIA);

		centerMap(coordinates);

		//Ver lineas en zona
	} else if (id == 13) {
		cleanInteraction();
		removeAllLayers();

		var card = $ds("#to_do_some");
		var button = '<button class="btn btn-secondary btn-fw" id="confZonaLinea">Confirmar zona</select>';

		$ds("a[href='#ui-basic']").click();
		$ds(card_title).html("Buscar L\u00EDnea por Zona");
		$ds(card_subtitle).html("");
		var form_group = $ds(card).find(".form-group");
		var table = $ds("#selectTableLineas").children("table").get(0);

		$ds(form_group).html(button);
		$ds(table).html('');

		$ds(table).off("click");

		addZonaLinea();

		var buttonConf = $ds("#confZonaLinea");

		$ds(buttonConf).off("click");


		$ds(buttonConf).on('click', function() {

			map.removeInteraction(snapZonaLinea);
			getZonaLinea();

		});

		//Ver ultimos cambios
	} else if (id == 14) {
		cleanInteraction()
		$ds("a[href='#ui-basic']").click();

		var card = $ds("#to_do_some");
		var form_group = $ds(card).find(".form-group");
		$ds(card_title).html("Modificaciones en las \u00FAltimas horas");
		$ds(card_subtitle).html("");

		var databody = $ds("#selectTableLineas").children("table").get(0);

		$ds(form_group).html('');
		$ds(databody).html('');


		$ds('#lastCahange').modal('show');

		var recorrido = '';

		$ds(databody).off("click");

		$ds(databody).on('click', 'tr', function() {
			if ($ds(this).hasClass('selected')) {
				$ds(this).removeClass('selected');
			}
			else {
				recorrido = $ds(this).attr('data-counter_id');

				$ds('#selectTableLineas tr.selected').removeClass('selected');
				$ds(this).addClass('selected');

				//bondisuy_LoadShow();
				getRecorrido(recorrido);
			}
		});


		// Ver mapa de calor
	} else if (id == 15) {
		cleanInteraction();
		removeAllLayers();
		/* Llama al método agregarMapaDeCalorDeParadas del archivo bondisuy_map.js */
		agregarMapaDeCalorDeParadas();
	}



}
