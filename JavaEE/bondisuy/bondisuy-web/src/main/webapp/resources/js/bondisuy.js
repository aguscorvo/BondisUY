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

	oli.each(function(index){
		if(!$ds(this).html().toUpperCase().includes($ds(oin).val().toUpperCase()) && $ds(oin).val()!=""){
			$ds(this).addClass("d-none");
		}
			
	});	

});


//Listar linea por Compania Ajax
function filtrarCompany(companyId, companyName) {
	if (companyId != '') {
		var url = "/bondisuy-web/LineaBondisuy?companyId=" + companyId;
		//var txtli = '<li class="map_filters_accordion_counter" data-counter_id="ALL">[Todas]</li>';
		var txtli = '';
		var cant = 0;
		var detalle = '<div class="form-group row m-2">';
		detalle += '<label for="" class="col-sm-5 col-form-label">Compa&ntilde;&iacute;a:';
		detalle += '</label>';
		detalle += '<div class="col-sm-7">';
		detalle += '<label for="" class="col-sm-5 col-form-label">' + companyName + '</label>';
		detalle += '</div>';
		detalle += '</div>';
		detalle += '<div class="form-group row m-2">';
		detalle += '<label for="" class="col-sm-5 col-form-label">L&iacute;neas:</label>';
		detalle += '<div class="col-sm-7">';


		//Se limpia dropbox
		var oul = $ds("div[data-filter_head='line']").next('ul');
		$ds(oul).html("");

		//Se limpia detalle
		var odet = $ds('#map_filters_content_detail');
		$ds(odet).html("");


		$ds.ajaxSetup({ mimeType: "text/plain" });

		$ds.getJSON(url)
			.done(function (data) {

				for (var lin in data) {
					txtli += '<li class="map_filters_accordion_counter" data-counter_id=' + data[lin].id + '>' + data[lin].nombre + ' ' + data[lin].origen + ' - ' + data[lin].destino + '</li>'
					cant += 1;
				}
				$ds(oul).html(txtli);

				detalle += '	<label for="" class="col-sm-5 col-form-label">' + cant + '</label>';
				detalle += '</div>';
				detalle += '</div>';

				$ds(odet).html(detalle);


			})
			.fail(function (jqxhr, textStatus, error) {
				var err = textStatus + ", " + error;
				console.log("Request Failed: " + err + "file: " + url);
			});
	}

}

//ver linea  Ajax
function filtrarLinea(lineaId) {
	if (lineaId != '') {
		var url = "/bondisuy-web/LineaBondisuy?lineaId=" + lineaId;
		var txtli = '<li class="map_filters_accordion_counter" data-counter_id="ALL">[Todas]</li>';
		var cant = 0;
		var detalle = '<div class="form-group row m-2">';
		detalle += '<label for="" class="col-sm-5 col-form-label">L&iacute;nea:';
		detalle += '</label>';
		detalle += '<div class="col-sm-7">';



		//Se limpia detalle
		var odet = $ds('#map_filters_content_detail');
		$ds(odet).html("");


		$ds.ajaxSetup({ mimeType: "text/plain" });

		$ds.getJSON(url)
			.done(function (data) {

				detalle += '<label for="" class="col-sm-5 col-form-label">' + data.nombre + '</label>';
				detalle += '</div>';
				detalle += '</div>';
				detalle += '<div class="form-group row m-2">';
				detalle += '<label for="" class="col-sm-5 col-form-label">Compa&ntilde;&iacute;a:';
				detalle += '</label>';
				detalle += '<div class="col-sm-7">';
				detalle += '<label for="" class="col-sm-5 col-form-label">' + data.compania.nombre + '</label>';
				detalle += '</div>';
				detalle += '</div>';
				detalle += '<div class="form-group row m-2">';
				detalle += '<label for="" class="col-sm-5 col-form-label">Origen:</label>';
				detalle += '<div class="col-sm-7">';
				detalle += '	<label for="" class="col-sm-5 col-form-label">' + data.origen + '</label>';
				detalle += '</div>';
				detalle += '</div>';
				detalle += '<div class="form-group row m-2">';
				detalle += '<label for="" class="col-sm-5 col-form-label">Destino:</label>';
				detalle += '<div class="col-sm-7">';
				detalle += '	<label for="" class="col-sm-5 col-form-label">' + data.destino + '</label>';
				detalle += '</div>';
				detalle += '</div>';
				$ds(odet).html(detalle);

			})
			.fail(function (jqxhr, textStatus, error) {
				var err = textStatus + ", " + error;
				console.log("Request Failed: " + err + "file: " + url);
			});
	}

}

//Mostrar mensaje error
function bondisuy_msgError(message){
	 $ds("#general_error_msj").html(message);
	 $ds('#general_error').modal('show');	
}

