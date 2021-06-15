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

	if (id == 1) {
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

				bondisuy_LoadShow();
				getRecorrido(recorrido);
			}
		});



	} else if (id == 2) {
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


	} else if (id == 3) {
		//$ds( "#selectTableLineas" ).off( "click", "**" );

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

		//Input CalleB
		$ds("#inputCalleB").on("keypress", function(ev) {

			switch (ev.which) {
				case 8: // Backspace
					nombreb = $ds(this).val();
					break;
				case 9: // Tab
				case 13: // Enter
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
			var size = $ds("#map").height() - 80 - $ds(this).offset().top;
			$ds("#selectTableLineas").height(size);
		});

		$ds("#inputCalleB").on("keydown", function(ev) {

			switch (ev.which) {
				case 8: // Backspace
					nombreb = $ds(this).val();
					break;
				case 9: // Tab
				case 13: // Enter
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

	} else if (id == 4) {
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
	} else if (id == 5) {
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



	} else if (id == 6) {
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

	} else if (id == 7) {
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

	} else if (id == 8) {
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

		borrarCapaPorNombre('DIRECCION');
		borrarCapaPorNombre('ESQUINA');
		borrarCapaPorNombre(L_RECORRIDOS);
		borrarCapaPorNombre(L_PARADAS);
		borrarCapaPorNombre(L_NUEVAPARADA);
		borrarCapaPorNombre(L_NUEVALINEA);

		addParada();

		var buttonConf = $ds("#confNuevaParada");

		$ds(buttonConf).off("click");

		$ds(buttonConf).on('click', function() {
			var point = new Proj4js.Point(coordNuevaParada);   //any object will do as long as it has 'x' and 'y' properties
			var point32721 = Proj4js.transform(proj4326, proj32721, point);      //do the transformation.  x and y are modified in place

			getRecorridoCercanosNuevaParada([point32721['x'], point32721['y']], DISTANCIA_LINEAPARADA);

		});


	} else if (id == 9) {
		$ds("a[href='#ui-busstop']").click();
		select = '<select class="form-control form-control-sm text-secondary" id="selectEmpresas"></select>';

		$ds(card_title).html("Buscar l&iacute;neas por empresa");
		$ds(card_subtitle).html("L&iacute;nea");
		$ds(form_group).html(select);

		listarCompany();

	} else if (id == 10) {
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

		borrarCapaPorNombre('DIRECCION');
		borrarCapaPorNombre('ESQUINA');
		borrarCapaPorNombre(L_RECORRIDOS);
		borrarCapaPorNombre(L_PARADAS);
		borrarCapaPorNombre(L_NUEVAPARADA);
		borrarCapaPorNombre(L_NUEVALINEA);

		addLinea();

		var buttonConf = $ds("#confNuevaLinea");

		$ds(buttonConf).off("click");


		$ds(buttonConf).on('click', function() {
			var point = new Proj4js.Point(coordNuevaParada);   //any object will do as long as it has 'x' and 'y' properties
			var point32721 = Proj4js.transform(proj4326, proj32721, point);      //do the transformation.  x and y are modified in place

			getCompanyNuevaLinea();
			
		});
		
		

	} else if (id == 11) {

	}

}
