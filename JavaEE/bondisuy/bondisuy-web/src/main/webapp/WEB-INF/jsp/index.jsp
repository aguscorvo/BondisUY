<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="/WEB-INF/tld/request_functions.tld" prefix="fn"%>

<!DOCTYPE html>
<html lang="en-US">
  <head>
    <!-- Required meta tags -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>BondisUY</title>
    <!-- plugins:css -->
    <link rel="stylesheet" href="/bondisuy-web/resources/assets/vendors/mdi/css/materialdesignicons.min.css">
    <link rel="stylesheet" href="/bondisuy-web/resources/assets/vendors/css/vendor.bundle.base.css">
    <!-- endinject -->
    <!-- Plugin css for this page -->
    <link rel="stylesheet" href="/bondisuy-web/resources/assets/vendors/jvectormap/jquery-jvectormap.css">
    <!-- End plugin css for this page -->
    <!-- inject:css -->
    <!-- endinject -->
    <!-- Layout styles -->
    <link rel="stylesheet" href="/bondisuy-web/resources/assets/css/style.css">
    
    <!-- OpenLayer -->	
	<link rel="stylesheet" href="webjars/openlayers/5.2.0/ol.css">
    
    <link rel="stylesheet" href="/bondisuy-web/resources/css/bondisuy.css">
    
    <!-- End layout styles -->
    <link rel="shortcut icon" href="/bondisuy-web/resources/images/favicon.svg" />
  </head>
  <body>
    <div class="container-scroller">
      <!-- partial:partials/_sidebar.html -->
      <nav class="sidebar sidebar-offcanvas" id="sidebar">
        <div class="sidebar-brand-wrapper d-none d-lg-flex align-items-center justify-content-center fixed-top">
          <a class="sidebar-brand brand-logo" href="#"><img src="/bondisuy-web/resources/images/logo.svg" alt="logo" /></a>
          <a class="sidebar-brand brand-logo-mini" href="#"><img src="/bondisuy-web/resources/images/logo-mini.svg" alt="logo" /></a>
        </div>
        <ul class="nav">
          <li class="nav-item nav-category">
            <span class="nav-link">Informaci&oacute;n</span>
          </li>
          <li class="nav-item menu-items">
            <a class="nav-link" data-toggle="collapse" href="#ui-basic" aria-expanded="false" aria-controls="ui-basic">
              <span class="menu-icon">
                <i class="mdi mdi-filter"></i>
              </span>
              <span class="menu-title">Buscar Informaci&oacute;n</span>
              <i class="menu-arrow"></i>
            </a>
            <div class="collapse" id="ui-basic">
              <ul class="nav flex-column sub-menu">
                <li class="nav-item"> <a class="nav-link" href="#">L&iacute;nea por empresa</a></li>
                <li class="nav-item"> <a class="nav-link" href="#">L&iacute;nea</a></li>
                <li class="nav-item"> <a class="nav-link" href="#">Esquina</a></li>
                <li class="nav-item"> <a class="nav-link" href="#">Direcci&oacute;n</a></li>
                <li class="nav-item"> <a class="nav-link" href="#">Avanzado</a></li>
              </ul>
            </div>
          </li>
          <li class="nav-item menu-items">
            <a class="nav-link" data-toggle="collapse" href="#ui-busstop" aria-expanded="false" aria-controls="ui-basic">
              <span class="menu-icon">
                <i class="mdi mdi-bus"></i>
              </span>
              <span class="menu-title">Paradas</span>
              <i class="menu-arrow"></i>
            </a>
            <div class="collapse" id="ui-busstop">
              <ul class="nav flex-column sub-menu">
                <li class="nav-item"> <a class="nav-link" href="#">Habilitadas</a></li>
                <li class="nav-item"> <a class="nav-link" href="#">Deshabilitadas</a></li>
              </ul>
            </div>
          </li>
          <li class="nav-item menu-items">
            <a class="nav-link" data-toggle="collapse" href="#ui-busline" aria-expanded="false" aria-controls="ui-basic">
              <span class="menu-icon">
                <i class="mdi mdi-vector-polyline"></i>
              </span>
              <span class="menu-title">L&iacute;neas</span>
              <i class="menu-arrow"></i>
            </a>
            <div class="collapse" id="ui-busline">
              <ul class="nav flex-column sub-menu">
                <li class="nav-item"> <a class="nav-link" href="#">Registro</a></li>
                
              </ul>
            </div>
          </li>
        </ul>
      </nav>
      <!-- partial -->
      <div class="container-fluid page-body-wrapper">
        <!-- partial:partials/_navbar.html -->
        <nav class="navbar p-0 fixed-top d-flex flex-row">
          <div class="navbar-brand-wrapper d-flex d-lg-none align-items-center justify-content-center">
            <a class="navbar-brand brand-logo-mini" href="index.html"><img src="/bondisuy-web/resources/images/logo-mini.svg" alt="logo" /></a>
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
          <div id="map" style="position: relative; overflow: hidden;">
		  </div>
        </div>
        <!-- main-panel ends -->
      </div>
      <!-- page-body-wrapper ends -->
    </div>
    <!-- container-scroller -->
    <!-- plugins:js -->
    <script src="/bondisuy-web/resources/assets/vendors/js/vendor.bundle.base.js"></script>
    <!-- endinject -->
    <!-- Plugin js for this page -->
    <script src="/bondisuy-web/resources/assets/vendors/jvectormap/jquery-jvectormap.min.js"></script>
    <script src="/bondisuy-web/resources/assets/vendors/jvectormap/jquery-jvectormap-world-mill-en.js"></script>
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
     
	<!-- Verificador de formnularios Login y Registro -->
	<script src="/bondisuy-web/resources/js/user-verification.js"></script>
	
	<!-- OpenLayer -->	
	<script type="text/javascript" src='webjars/openlayers/5.2.0/ol.js'></script>
	
	<!-- Bondisuy -->
	<script src="/bondisuy-web/resources/js/bondisuy.js"></script>
	<script src="/bondisuy-web/resources/js/bondisuy_map.js"></script>

    <!-- End custom js for this page -->
  </body>
</html>