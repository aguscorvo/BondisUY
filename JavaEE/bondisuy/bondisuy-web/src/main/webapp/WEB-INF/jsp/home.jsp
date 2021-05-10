<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
    
    <%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
    
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
<body>

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
			$ds('#general_error_msj').html('${sessionScope.MENSAJE_ERROR_GENERAL}');
			$ds('#general_error').modal('show');
		</script>	
		<c:remove var="MENSAJE_ERROR_GENERAL" scope="session" />
	</c:if>


</body>
</html>