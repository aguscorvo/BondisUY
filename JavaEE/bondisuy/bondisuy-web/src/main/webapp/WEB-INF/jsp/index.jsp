<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="/WEB-INF/tld/request_functions.tld" prefix="fn"%>

<!DOCTYPE html>
<html lang="en-US">
<head>
<!-- Required meta tags -->
<meta charset="UTF-8">
<meta name="viewport"
	content="width=device-width, initial-scale=1, shrink-to-fit=no">
<title>BondisUY</title>
<!-- Bootstrap -->
<link rel="stylesheet"
	href="webjars/bootstrap/4.6.0-1/css/bootstrap.min.css">


<!-- plugins:css -->
<link rel="stylesheet"
	href="/bondisuy-web/resources/assets/vendors/mdi/css/materialdesignicons.min.css">
<link rel="stylesheet"
	href="/bondisuy-web/resources/assets/vendors/css/vendor.bundle.base.css">
<!-- endinject -->
<!-- Plugin css for this page -->
<link rel="stylesheet"
	href="/bondisuy-web/resources/assets/vendors/jvectormap/jquery-jvectormap.css">
<!-- End plugin css for this page -->
<!-- inject:css -->
<!-- endinject -->
<!-- Layout styles -->
<link rel="stylesheet"
	href="/bondisuy-web/resources/assets/css/style.css">

<!-- OpenLayer -->
<link rel="stylesheet" href="webjars/openlayers/6.5.0/ol.css">

<link rel="stylesheet" href="/bondisuy-web/resources/css/bondisuy.css">

<!-- End layout styles -->
<link rel="shortcut icon"
	href="/bondisuy-web/resources/images/favicon.svg" />
</head>
<body>
	<div class="container-scroller">
		<!-- partial:partials/_sidebar.html -->
		<nav class="sidebar sidebar-offcanvas" id="sidebar">
			<div
				class="sidebar-brand-wrapper d-none d-lg-flex align-items-center justify-content-center fixed-top">
				<a class="sidebar-brand brand-logo" href="#"><img
					src="/bondisuy-web/resources/images/logo.svg" alt="logo" /></a> <a
					class="sidebar-brand brand-logo-mini" href="#"><img
					src="/bondisuy-web/resources/images/logo-mini.svg" alt="logo" /></a>
			</div>
			<ul class="nav mb-1">
				<li class="nav-item nav-category"><span class="nav-link">Informaci&oacute;n</span>
				</li>
				<li class="nav-item menu-items"><a class="nav-link"
					data-toggle="collapse" href="#ui-basic" aria-expanded="false"
					aria-controls="ui-basic"> <span class="menu-icon"> <i
							class="mdi mdi-filter"></i>
					</span> <span class="menu-title"> Buscar Informaci&oacute;n</span> <i
						class="menu-arrow"></i>
				</a>
					<div class="collapse" id="ui-basic">
						<ul class="nav flex-column sub-menu">
							<li class="nav-item"><a class="nav-link"
								href="javascript:searchOptions(1);">L&iacute;nea por empresa</a></li>
							<li class="nav-item"><a class="nav-link"
								href="javascript:searchOptions(2);">L&iacute;nea</a></li>
							<li class="nav-item"><a class="nav-link"
								href="javascript:searchOptions(3);">Esquina</a></li>
							<li class="nav-item"><a class="nav-link"
								href="javascript:searchOptions(4);">Direcci&oacute;n</a></li>
							<li class="nav-item"><a class="nav-link"
								href="javascript:searchOptions(5);">Paradas Habilitadas</a></li>
							<li class="nav-item"><a class="nav-link"
								href="javascript:searchOptions(6);">Paradas Deshabilitadas</a></li>
							<li class="nav-item"><a class="nav-link"
								href="javascript:searchOptions(7);">Ver l&iacute;neas
									Cercanas</a></li>
							<li class="nav-item"><a class="nav-link"
								href="javascript:searchOptions(12);">Ver Paradas Cercanas</a></li>
							<li class="nav-item"><a class="nav-link"
								href="javascript:searchOptions(13);">Ver l&iacute;neas en
									zona</a></li>
							<li class="nav-item"><a class="nav-link"
								href="javascript:searchOptions(14);">Ver &uacuteltimos
									cambios</a></li>
							<li class="nav-item"><a class="nav-link"
								href="javascript:searchOptions(15);">Ver mapa de calor</a></li>
						</ul>
					</div></li>
				<c:if test="${(sessionScope.USER!=null)}">
					<li class="nav-item menu-items"><a class="nav-link"
						data-toggle="collapse" href="#ui-busstop" aria-expanded="false"
						aria-controls="ui-basic"> <span class="menu-icon"> <i
								class="mdi mdi-bus"></i>
						</span> <span class="menu-title">Paradas</span> <i class="menu-arrow"></i>
					</a>
						<div class="collapse" id="ui-busstop">
							<ul class="nav flex-column sub-menu">
								<li class="nav-item"><a class="nav-link"
									href="javascript:searchOptions(8);">Alta</a></li>
								<li class="nav-item"><a class="nav-link"
									href="javascript:searchOptions(9);">Modificaci&oacute;n</a></li>
							</ul>
						</div></li>
					<li class="nav-item menu-items"><a class="nav-link"
						data-toggle="collapse" href="#ui-busline" aria-expanded="false"
						aria-controls="ui-basic"> <span class="menu-icon"> <i
								class="mdi mdi-vector-polyline"></i>
						</span> <span class="menu-title">L&iacute;neas</span> <i
							class="menu-arrow"></i>
					</a>
						<div class="collapse" id="ui-busline">
							<ul class="nav flex-column sub-menu">
								<li class="nav-item"><a class="nav-link"
									href="javascript:searchOptions(10);">Alta</a></li>
								<li class="nav-item"><a class="nav-link"
									href="javascript:searchOptions(11);">Modificaci&oacute;n</a></li>
							</ul>
						</div></li>
				</c:if>
			</ul>
			<div class="card" id="to_do_some">
				<div class="card-body pb-0">
					<h6 class="card-title"></h6>
					<div class="form-group"></div>
				</div>
				<div class="card">
					<div class="card-body p-3">
						<h7 class="card-title"></h7>
						<div class="row">
							<div class="table-responsive" id="selectTableLineas">
								<table class="table">

								</table>
							</div>
						</div>
					</div>
				</div>

			</div>
		</nav>
		<!-- partial -->
		<div class="container-fluid page-body-wrapper">
			<!-- partial:partials/_navbar.html -->
			<nav class="navbar p-0 fixed-top d-flex flex-row">
				<div
					class="navbar-brand-wrapper d-flex d-lg-none align-items-center justify-content-center">
					<a class="navbar-brand brand-logo-mini" href="#"><img
						src="/bondisuy-web/resources/images/logo-mini.svg" alt="logo" /></a>
				</div>

				<!-- header -->
				<c:choose>
					<c:when test="${(sessionScope.USER!=null)}">
						<%@ include file="/WEB-INF/includes/header_logued.jspf"%>
					</c:when>
					<c:otherwise>
						<%@ include file="/WEB-INF/includes/header_notlogued.jspf"%>
					</c:otherwise>
				</c:choose>
				<!-- /header -->

			</nav>
			<!-- partial -->
			<div class="main-panel">
				<div id="map" style="position: relative; overflow: hidden;"></div>
			</div>
			<!-- main-panel ends -->
		</div>
		<!-- page-body-wrapper ends -->
	</div>

	<!-- POPUP Mapa INFO-->
	<div id="mappopup" data-toggle="popover" data-placement="top"
		data-content="" data-html="true"></div>

	<!-- Modal ERROR-->
	<div class="modal error-modal" tabindex="-1" role="dialog"
		id="general_error">
		<div class="modal-dialog" role="document">
			<div class="modal-content bg-secondary text-dark">
				<div class="modal-header">
					<h5 class="modal-title" id="errorModalLabel">Error</h5>
					<button type="button" class="close text-light" data-dismiss="modal"
						aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div class="col-md-3 d-flex flex-row" id="general_error_icon">
						<h1>
							<i class="mdi mdi-alert display-3" style="color: #cc0000"></i>
						</h1>
					</div>
					<p id="general_error_msj"></p>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-dark" data-dismiss="modal">Cerrar</button>
				</div>
			</div>
		</div>
	</div>


	<div class="modal" tabindex="-1" role="dialog" id="general_loader">
		<div class="loader-demo-box border-0">
			<div class="jumping-dots-loader">
				<span></span> <span></span> <span></span>
			</div>
		</div>
	</div>

	<div class="modal" tabindex="-1" role="dialog" id="general_info_modal">
		<div class="loader-demo-box border-0">
			<div class="modal-dialog" role="document">
				<div class="modal-content"></div>
			</div>
		</div>
	</div>

	<!-- Modal ADD PARADA-->
	<div class="modal" tabindex="-1" role="dialog" id="addParada">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h3 class="modal-title">Crear Parada</h3>
					<button type="button" class="close text-light" data-dismiss="modal"
						aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div class="col-12">
						<div class="col-12 d-flex flex-row validate-input">
							<div class="col-3  mb-3">
								<label for="addParadaName">Nombre</label>
							</div>
							<div class="col-9  mb-3">
								<input type="text" class="form-control mb-3" id="addParadaName"
									name="addParadaName" placeholder="Nombre">
							</div>
						</div>
						<div class="col-12 d-flex flex-row validate-input">
							<div class="col-12  mb-3">
								<div class="form-group">
									<label for="addNuevaParadaLineasCercanas">L&iacute;neas
										Cercanas</label> <select multiple class="form-control"
										id="addNuevaParadaLineasCercanas">

									</select>
								</div>
							</div>
						</div>
					</div>
					<div class="col-12">
						<div class="col-12 d-flex flex-row">
							<button type="button" onclick='addParadaPOSTREST()'
								id="buttonAddParadaREST" class="btn btn-primary">CREAR</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Modal ADD LINEA-->
	<div class="modal" tabindex="-1" role="dialog" id="addLinea">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h3 class="modal-title">Crear L&iacute;nea</h3>
					<button type="button" class="close text-light" data-dismiss="modal"
						aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div class="col-12">
						<div class="col-12 d-flex flex-row validate-input">
							<div class="col-3  mb-3">
								<label for="addLineaName">Nombre L&iacute;nea</label>
							</div>
							<div class="col-9  mb-3">
								<input type="text" class="form-control mb-3" id="addLineaName"
									name="addLineaName" placeholder="Nombre">
							</div>
						</div>
						<div class="col-12 d-flex flex-row validate-input">
							<div class="col-3  mb-3">
								<label for="addLineaDescripcion">Descripci&oacute;n</label>
							</div>
							<div class="col-9  mb-3">
								<input type="text" class="form-control mb-3"
									id="addLineaDescripcion" name="addLineaDescripcion"
									placeholder="Descripci&oacute;n">
							</div>
						</div>
						<div class="col-12 d-flex flex-row validate-input">
							<div class="col-3  mb-3">
								<label for="addLineaEmpresa">Compa&ntilde;&iacute;a</label>
							</div>
							<div class="col-9  mb-3">
								<select class="form-control form-control-sm text-secondary"
									id="addLineaEmpresa"></select>
							</div>
						</div>
					</div>
					<div class="col-12">
						<div class="col-12 d-flex flex-row">
							<button type="button" onclick='addLineaPOSTREST()'
								id="buttonAddLineaREST" class="btn btn-primary">CREAR</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Modal ULTIMOS CAMBIOS-->
	<div class="modal" tabindex="-1" role="dialog" id="lastCahange">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h3 class="modal-title">&Uacute;ltimos cambios</h3>
					<button type="button" class="close text-light" data-dismiss="modal"
						aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div class="col-12">
						<div class="col-12 d-flex flex-row validate-input">
							<div class="col-3  mb-3">
								<label for="changeParadaLinea">Tipo</label>
							</div>
							<div class="col-9  mb-3">
								<select class="form-control form-control-sm text-secondary"
									id="changeParadaLinea">
									<option value="PAR">Paradas</option>
									<option value="LIN">L&iacute;neas</option>
								</select>
							</div>
						</div>
						<div class="col-12 d-flex flex-row validate-input">
							<div class="col-3  mb-3">
								<label for="changeTiempoHoras">Tiempo en horas</label>
							</div>
							<div class="col-9  mb-3">
								<input type="number" class="form-control mb-3"
									id="changeTiempoHoras" name="changeTiempoHoras"
									min="0" max="24"
									>
							</div>
						</div>
						
					</div>
					<div class="col-12">
						<div class="col-12 d-flex flex-row">
							<button type="button" onclick='changeLineaVER()'
								id="buttonChangeParadaLineaREST" class="btn btn-primary">Ver</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>


	<!-- jquery -->
	<script src="/bondisuy-web/resources/js/jquery.min.js"></script>

	<!-- plugins:js-->
	<script
		src="/bondisuy-web/resources/assets/vendors/js/vendor.bundle.base.js"></script>


	<!-- endinject -->
	<!-- Popper -->
	<script type="text/javascript"
		src='webjars/popper.js/1.12.9-1/umd/popper.min.js'></script>
	<!-- <script type="text/javascript" src='webjars/jquery-ui/1.12.1/jquery-ui.min.js'></script> -->
	<!-- Bootstrap JS-->
	<script type="text/javascript"
		src='webjars/bootstrap/4.6.0-1/js/bootstrap.min.js'></script>
	<script type="text/javascript"
		src='webjars/bootstrap/4.6.0-1/js/bootstrap.bundle.min.js'></script>

	<!-- Plugin js for this page -->
	<script
		src="/bondisuy-web/resources/assets/vendors/jvectormap/jquery-jvectormap.min.js"></script>
	<script
		src="/bondisuy-web/resources/assets/vendors/jvectormap/jquery-jvectormap-world-mill-en.js"></script>
	<!-- End plugin js for this page -->
	<!-- inject:js -->
	<script src="/bondisuy-web/resources/assets/js/off-canvas.js"></script>
	<script src="/bondisuy-web/resources/assets/js/hoverable-collapse.js"></script>
	<script src="/bondisuy-web/resources/assets/js/misc.js"></script>
	<script src="/bondisuy-web/resources/assets/js/settings.js"></script>
	<script src="/bondisuy-web/resources/assets/js/todolist.js"></script>
	<!-- endinject -->
	<!-- Custom js for this page -->
	<script src="/bondisuy-web/resources/assets/js/dashboard.js"></script>

	<!-- OpenLayer -->
	<script type="text/javascript" src='webjars/openlayers/6.5.0/ol.js'></script>

	<!-- Bondisuy -->
	<script src="/bondisuy-web/resources/js/proj4js-combined.js"></script>
	<script src="/bondisuy-web/resources/js/defs/EPSG32721.js"></script>
	<script src="/bondisuy-web/resources/js/bondisuy_func.js"></script>
	<script src="/bondisuy-web/resources/js/bondisuy.js"></script>
	<script src="/bondisuy-web/resources/js/bondisuy_map_var.js"></script>
	<script src="/bondisuy-web/resources/js/bondisuy_map_style.js"></script>
	<script src="/bondisuy-web/resources/js/bondisuy_map.js"></script>
	<script src="/bondisuy-web/resources/js/bondisuy_map_query.js"></script>


	<!-- End custom js for this page -->

	<c:if test="${not empty sessionScope.MENSAJE_ERROR_LOGIN}">
		<script type="text/javascript">
			$ds('[data-target="#loginModal"]').click();
		</script>
		<c:remove var="MENSAJE_ERROR_LOGIN" scope="session" />
	</c:if>


</body>

</html>