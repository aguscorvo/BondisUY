<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="/WEB-INF/tld/request_functions.tld" prefix="fn"%>

<!DOCTYPE html>
<html lang="zxx">

<head>
<meta charset="ISO-8859-1">
<title>Bondis Uy</title>


<!-- mobile responsive meta -->
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="viewport"
	content="width=device-width, initial-scale=1, maximum-scale=1">

<!-- incluyo las librerias necesarias -->
<%@ include file="/WEB-INF/includes/header_lib.jspf"%>

</head>
<body class="text-light bg-secondary">

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



	<!-- body-->
	<div class="main text-light">
		<div id="map" class="bg-light border border-secondary"></div>
		<div class="map_filters bg-light border border-secondary">
			<div class="map_filters_title bg-dark">
				<div class="map_filters_title_text">Filtros</div>
				<div class="map_filter_title_icon">
					<i class="fa fa-bars" aria-hidden="true"></i>
				</div>
			</div>
			<div class="map_filters_content text-dark">
				<div class="form-group row m-2">
					<label for="companyName" class="col-sm-5 col-form-label">Compa&ntilde;&iacute;a</label>
					<div class="col-sm-7">

						<div class="map_filters_select_accordion">
							<div class="d-flex flex-row border border-secondary">
								<div class="map_filters_accordion_sel">&nbsp;</div>
								<a
									class="map_filters_accordion flex-shrink-1 border border-secondary"
									href="#"> <i class="fa fa-caret-down" aria-hidden="true"></i>
								</a>
							</div>
							<div class="map_filters_accordion_content bg-light"
								data-counter_type="company">
								<div class="head_search_bar d-flex border border-secondary"
									data-filter_head="company">
									<input class="w-100" type="text" placeholder="Buscar..." /> <i
										class="fa fa-search flex-shrink-1 p-1" aria-hidden="false"></i>
								</div>
								<ul>
									<li class="map_filters_accordion_counter" data-counter_id="ALL">[Todas]</li>
									<c:forEach items="${requestScope.COMPANYS}" var="dtCompany">
										<li class="map_filters_accordion_counter"
											data-counter_id="${dtCompany.id}">${dtCompany.nombre}</li>
									</c:forEach>
								</ul>
							</div>
						</div>
					</div>
				</div>
				<div class="form-group row m-2">
					<label for="companyName" class="col-sm-5 col-form-label">L&iacute;neas</label>
					<div class="col-sm-7">

						<div class="map_filters_select_accordion">
							<div class="d-flex flex-row border border-secondary">
								<div class="map_filters_accordion_sel">&nbsp;</div>
								<a
									class="map_filters_accordion flex-shrink-1 border border-secondary"
									href="#"> <i class="fa fa-caret-down" aria-hidden="true"></i>
								</a>
							</div>
							<div class="map_filters_accordion_content bg-light"
								data-counter_type="line">
								<div class="head_search_bar d-flex border border-secondary"
									data-filter_head="line">
									<input class="w-100" type="text" placeholder="Buscar..." /> <i
										class="fa fa-search flex-shrink-1 p-1" aria-hidden="false"></i>
								</div>
								<ul>
									<%--<li class="map_filters_accordion_counter" data-counter_id="ALL">[Todas]</li> --%>
									<c:forEach items="${requestScope.LINEAS}" var="dtLine">
										<li class="map_filters_accordion_counter"
											data-counter_id="${dtLine.id}">${dtLine.nombre}&nbsp;${dtLine.origen}-${dtLine.destino}</li>
									</c:forEach>
								</ul>
							</div>
						</div>
					</div>
				</div>

			</div>
		</div>
		<div class="map_filters bg-light border border-secondary">
			<div class="map_filters_title bg-dark">
				<div class="map_filters_title_text">Detalle</div>
				<div class="map_filter_title_icon">
					<i class="fa fa-bars" aria-hidden="true"></i>
				</div>
			</div>
			<div class="map_filters_content text-dark" id="map_filters_content_detail">
				<div class="form-group row m-2">
					<label for="companyName" class="col-sm-5 col-form-label">Compa&ntilde;&iacute;a:
					</label>
					<div class="col-sm-7">
						<label for="companyName" class="col-sm-5 col-form-label">[Todas]</label>
					</div>
				</div>
				<div class="form-group row m-2">
					<label for="companyName" class="col-sm-5 col-form-label">L&iacute;neas:</label>
					<div class="col-sm-7">
						<label for="companyName" class="col-sm-5 col-form-label">${fn:listSize(requestScope.LINEAS)}</label>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- /Body -->








	<!-- footer -->
	<!-- incluyo el footer -->
	<%@ include file="/WEB-INF/includes/footer_lib.jspf"%>
	<!-- /footer -->
	<c:if test="${not empty sessionScope.MENSAJE_ERROR_LOGIN}">
		<script type="text/javascript">
			var $ds = jQuery.noConflict();
			$ds('[data-target="#loginModal"]').click();
		</script>
		<c:remove var="MENSAJE_ERROR_LOGIN" scope="session" />
	</c:if>

	<c:if test="${not empty sessionScope.MENSAJE_ERROR_GENERAL}">
		<script type="text/javascript">
			var $ds = jQuery.noConflict();
			$ds('#general_error_msj').html(
					'${sessionScope.MENSAJE_ERROR_GENERAL}');
			$ds('#general_error').modal('show');
		</script>
		<c:remove var="MENSAJE_ERROR_GENERAL" scope="session" />
	</c:if>


</body>
</html>