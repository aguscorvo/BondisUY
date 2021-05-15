var $ds = jQuery.noConflict();
var open_sel = null;
var company = "company";
var line = "line";




/*Select de filtros red_movil_map_filters_accordion*/
$ds(".map_filters_accordion").click(function () {

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
$ds(".map_filters_accordion_content").on("click", ".map_filters_accordion_counter", function () {
	var oul = $ds(this).parent();
	var odiv = $ds(oul).parent(".map_filters_accordion_content");
	var pdiv = $ds(odiv).parent(".map_filters_select_accordion");
	var odivs = $ds(pdiv).find(".map_filters_accordion_sel");

	switch (odiv.attr("data-counter_type").toLowerCase()) {
		case company:
			filtrarCompany($ds(this).attr("data-counter_id"), $ds(this).html());
			$ds(".map_filters_accordion_sel").each(function (index) {
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
$ds(".head_search_bar").on("click", "i", function () {
	var odiv = $ds(this).parent();
	var oin = $ds(odiv).children("input").get(0);
	var odivp = $ds(odiv).parent();
	var oli = $ds(odivp).find(".map_filters_accordion_counter");

	$ds(oli).removeClass("d-none");

	oli.each(function (index) {
		if (!$ds(this).html().toUpperCase().includes($ds(oin).val().toUpperCase()) && $ds(oin).val() != "") {
			$ds(this).addClass("d-none");
		}

	});

});


//Select Empresas
$ds("#selectEmpresas").on("change", function () {
	filtrarLineaByCompany($ds(this).val());
	var size = $ds("#map").height() - 50 - $ds(this).offset().top;
	$ds("#selectTableLineas").height(size);
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

	//.addClass( "yourClass" )
	if (id == 1) {
		$ds("a[href='#ui-basic']").click();
		select = '<select class="form-control form-control-sm text-secondary" id="selectEmpresas"></select>';

		$ds(card_title).html("Buscar l&iacute;neas por empresa");
		$ds(card_subtitle).html("L&iacute;nea");
		$ds(form_group).html(select);

		listarCompany();
		filtrarLineaByCompany('');

		//Select Empresas
		$ds("#selectEmpresas").on("change", function () {
			filtrarLineaByCompany($ds(this).val());
			var size = $ds("#map").height() - 50 - $ds(this).offset().top;
			$ds("#selectTableLineas").height(size);
		});


	} else if (id == 2) {
		$ds("a[href='#ui-basic']").click();
		select = '<input type="text" class="form-control form-control-sm" id="inputLinea">';
		$ds(card_title).html("Buscar l&iacute;nea");
		$ds(card_subtitle).html("L&iacute;nea");
		$ds(form_group).html(select);

		//Input Linea
		$ds("#inputLinea").on("keypress", function (ev) {
			var nombre;
			switch (ev.which) {
				case 8: // Backspace
					nombre = $ds(this).val();
				case 9: // Tab
				case 13: // Enter
				case 37: // Left
				case 38: // Up
				case 39: // Right
				case 40: // Down
					break;
				default:
					nombre = $ds(this).val() + String.fromCharCode(ev.which);
			}
			filtrarLineaByName(nombre);
			var size = $ds("#map").height() - 50 - $ds(this).offset().top;
			$ds("#selectTableLineas").height(size);
		});

		$ds("#inputLinea").on("keydown", function (ev) {
			switch (ev.which) {
				case 8: // Backspace
					nombre = $ds(this).val();
				case 9: // Tab
				case 13: // Enter
				case 37: // Left
				case 38: // Up
				case 39: // Right
				case 40: // Down
					break;

				default:
					nombre = $ds(this).val() + String.fromCharCode(ev.which);
			}
			filtrarLineaByName(nombre);
			var size = $ds("#map").height() - 50 - $ds(this).offset().top;
			$ds("#selectTableLineas").height(size);
		});

	} else if (id == 3){
		$ds("a[href='#ui-basic']").click();
		select = '<label for="inputCalleA">Calle</label><input type="text" class="form-control form-control-sm" id="inputCalleA">';
		select += '<label for="inputCalleB">Esquina</label><input type="text" class="form-control form-control-sm" id="inputCalleB">';
		$ds(card_title).html("Buscar Esquina");
		$ds(card_subtitle).html("Calle");
		$ds(form_group).html(select);

		//Input Linea
		$ds("#inputCalleA").on("keypress", function (ev) {
			var nombre;
			switch (ev.which) {
				case 8: // Backspace
					nombre = $ds(this).val();
				case 9: // Tab
				case 13: // Enter
				case 37: // Left
				case 38: // Up
				case 39: // Right
				case 40: // Down
					break;
				default:
					nombre = $ds(this).val() + String.fromCharCode(ev.which);
			}
			filtrarCalleByName(nombre);
			var size = $ds("#map").height() -80 - $ds(this).offset().top;
			$ds("#selectTableLineas").height(size);
		});

		$ds("#inputCalleA").on("keydown", function (ev) {
			switch (ev.which) {
				case 8: // Backspace
					nombre = $ds(this).val();
				case 9: // Tab
				case 13: // Enter
				case 37: // Left
				case 38: // Up
				case 39: // Right
				case 40: // Down
					break;

				default:
					nombre = $ds(this).val() + String.fromCharCode(ev.which);
			}
			filtrarCalleByName(nombre);
			var size = $ds("#map").height() - 80 - $ds(this).offset().top;
			$ds("#selectTableLineas").height(size);
		});

		//Input Linea
		$ds("#inputCalleB").on("keypress", function (ev) {
			var nombre;
			switch (ev.which) {
				case 8: // Backspace
					nombre = $ds(this).val();
				case 9: // Tab
				case 13: // Enter
				case 37: // Left
				case 38: // Up
				case 39: // Right
				case 40: // Down
					break;
				default:
					nombre = $ds(this).val() + String.fromCharCode(ev.which);
			}
			filtrarCalleByName(nombre);
			var size = $ds("#map").height() - 80 - $ds(this).offset().top;
			$ds("#selectTableLineas").height(size);
		});

		$ds("#inputCalleB").on("keydown", function (ev) {
			switch (ev.which) {
				case 8: // Backspace
					nombre = $ds(this).val();
				case 9: // Tab
				case 13: // Enter
				case 37: // Left
				case 38: // Up
				case 39: // Right
				case 40: // Down
					break;

				default:
					nombre = $ds(this).val() + String.fromCharCode(ev.which);
			}
			filtrarCalleByName(nombre);
			var size = $ds("#map").height() - 80 - $ds(this).offset().top;
			$ds("#selectTableLineas").height(size);
		});


	}

}
//Listar todas las Empresas
function listarCompany() {
	var options = '<option	value=""></option>';
	var url = "/bondisuy-web/CompanyBondisuy?companyId=ALL";

	$ds.ajaxSetup({ mimeType: "text/plain" });

	$ds.getJSON(url)
		.done(function (data) {

			for (var op in data) {
				options += '<option	value="' + data[op].id + '">' + data[op].nombre + '</option>'
			}

			$ds("#selectEmpresas").html(options);

		})
		.fail(function (jqxhr, textStatus, error) {
			var err = textStatus + ", " + error;
			console.log("Request Failed: " + err + "file: " + url);
		});

}


//Listar Lineas por Empresa
function filtrarLineaByCompany(companyId) {
	var txttable = '<thead><tr><th>l&iacute;nea</th><th>origen</th><th>destino</th></tr></thead><tbody>';
	var table = $ds("#selectTableLineas").children("table").get(0);

	if (companyId != '' && companyId != null) {
		var url = "/bondisuy-web/LineaBondisuy?companyId=" + companyId;


		$ds.ajaxSetup({ mimeType: "text/plain" });

		$ds.getJSON(url)
			.done(function (data) {

				for (var td in data) {
					txttable += '<tr data-counter_id=' + data[td].id + '><td>' + data[td].nombre + '</td><td>' + data[td].origen + '</td><td>' + data[td].destino + '</td></tr>'
				}

				txttable += '</tbody>';

				$ds(table).html(txttable);

			})
			.fail(function (jqxhr, textStatus, error) {
				var err = textStatus + ", " + error;
				console.log("Request Failed: " + err + "file: " + url);
			});
	} else {
		txttable += '</tbody>';
		$ds(table).html(txttable);

	}
}



//filtrar linea por Nombre
function filtrarCalleByName(calleName) {
	var txttable = '<thead><tr><th>c&oacute;digo</th><th>nombre</th><th>tipo</th></tr></thead><tbody>';
	var table = $ds("#selectTableLineas").children("table").get(0);

	if (calleName != '') {
		var url = "/bondisuy-web/bondisuyrest/servicios/srchservicio/calle/" + calleName;

		$ds.ajaxSetup({ mimeType: "text/plain" });

		$ds.getJSON(url)
			.done(function (data) {
				for (var td in data) {
					txttable += '<tr data-counter_id=' + data[td].codigo + '><td>' + data[td].codigo + '</td><td>' + data[td].nombre + '</td><td>' + data[td].tipo + '</td></tr>'
				}

				txttable += '</tbody>';

				$ds(table).html(txttable);
			})
			.fail(function (jqxhr, textStatus, error) {
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
	var txttable = '<thead><tr><th>l&iacute;nea</th><th>origen</th><th>destino</th></tr></thead><tbody>';
	var table = $ds("#selectTableLineas").children("table").get(0);

	if (lineaName != '') {
		var url = "/bondisuy-web/LineaBondisuy?lineaName=" + lineaName;

		$ds.ajaxSetup({ mimeType: "text/plain" });

		$ds.getJSON(url)
			.done(function (data) {
				for (var td in data) {
					txttable += '<tr data-counter_id=' + data[td].id + '><td>' + data[td].nombre + '</td><td>' + data[td].origen + '</td><td>' + data[td].destino + '</td></tr>'
				}

				txttable += '</tbody>';

				$ds(table).html(txttable);
			})
			.fail(function (jqxhr, textStatus, error) {
				var err = textStatus + ", " + error;
				console.log("Request Failed: " + err + "file: " + url);
			});
	} else {
		txttable += '</tbody>';
		$ds(table).html(txttable);
	}

}

//Mostrar mensaje error
function bondisuy_msgError(message) {
	$ds("#general_error_msj").html(message);
	$ds('#general_error').modal('show');
}

