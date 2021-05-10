/**
 * 
 */

var $ds = jQuery.noConflict();

//Verificacion Login
$ds('.validate-form').on('submit',function(){
    var correo = true;
	var check = true;
	
	$ds('#loginMailError').addClass('d-none');
	$ds('#loginNameError').addClass('d-none');
	$ds('#loginPasswordError').addClass('d-none');
	
	if($ds('#loginMail').val().trim() != ''){
		if($ds('#loginMail').val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null){
			$ds('#loginMailError').removeClass('d-none');
			check = false;
		}    
	}else{
	    correo = false;
	}

	if($ds('#loginName').val().trim() == ''){
	    if(!correo){
			$ds('#loginMailError').removeClass('d-none');
			$ds('#loginNameError').removeClass('d-none');
		    check = false;
	    }
    }
	
	if($ds('#loginPassword').val().trim() == ''){
    	$ds('#loginPasswordError').removeClass('d-none');
		check = false;
    }
    return check;
});

//Verificacion Registro
$ds('.register-form').on('submit',function(){
 	var check = true;

	$ds('.register-form .validate-input').each(function(index){
		var input = $ds(this).children("input");
		var iderr = "#" + $ds(input).attr("id") + "Error";
		
		if($ds(input).val().trim() == ''){
			$ds(iderr).removeClass('d-none');
			check = false;
		}else{
			if($ds(input).attr('type') == 'email' || $ds(input).attr('name') == 'email') {
	            if($ds(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
	               $ds(iderr).removeClass('d-none');
					check = false;
	            }
	        }else{
				$ds(iderr).addClass('d-none');
			}
			
		}
	});


	if($ds('#signupPassword').val().trim() != ''){
		if($ds('#signupPassword').val().trim()!=$ds('#signupPasswordVer').val().trim()){
			$ds('#signupPasswordVerError').removeClass('d-none');
			check = false;
		}else{
			$ds('#signupPasswordVerError').addClass('d-none');
		}		
	}	

	if($ds( '#signupTipoUsuarioD' ).is(':checked')){
		if($ds("#signupInstitutos option:selected" ).length==0){
			$ds('#signupInstitutosError').removeClass('d-none');
			check = false;
		}else{
			$ds('#signupInstitutosError').addClass('d-none');
		}
	}

    return check;	

});

//Configuracion Lista de Institutos para Docentes
$ds( '#signupTipoUsuarioD' ).on( 'click', function() {
    if( $ds(this).is(':checked') ){
    	$ds('#signupInstitutosList').removeClass('d-none');	    
    }
});

$ds( '#signupTipoUsuarioE' ).on( 'click', function() {
    if( $ds(this).is(':checked') ){
    	$ds('#signupInstitutosList').addClass('d-none');	    
    }
});


//Configuracion Datepicker
$ds.datepicker.regional['es'] = {
		 closeText: 'Cerrar',
		 prevText: '< Ant',
		 nextText: 'Sig >',
		 currentText: 'Hoy',
		 monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
		 monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
		 dayNames: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
		 dayNamesShort: ['Dom','Lun','Mar','Mie','Juv','Vie','Sab'],
		 dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sa'],
		 weekHeader: 'Sm',
		 dateFormat: 'dd/mm/yy',
		 firstDay: 0,
		 isRTL: false,
		 showMonthAfterYear: false,
		 yearSuffix: ''
	 };

 $ds.datepicker.setDefaults($ds.datepicker.regional['es']);

$ds( function() {
    $ds( "#signupFechaNacimiento" ).datepicker({
		showOn: "button",
		buttonImage: "/edEXTWeb/resources/images/calendar.png",
		buttonImageOnly: true,
		buttonText: "Seleccionar Fecha",
		dateFormat: "dd/mm/yy",
		changeMonth: true,
		changeYear: true,
		minDate: new Date(1950, 01, 01),
		maxDate: new Date()  
    });
    
  } );

//Carga de imagen y preview
$ds(function() {
	$ds('#signupFile').change(function(e) {
	addImage(e); 
});

function addImage(e){
	var file = e.target.files[0],
	imageType = /image.*/;
	      
	if (!file.type.match(imageType))
		return;
	
	var reader = new FileReader();
		reader.onload = fileOnload;
		reader.readAsDataURL(file);
	}
	    
	function fileOnload(e) {
		var result=e.target.result;
		$ds('#signupFilePreview').attr("src",result);
	}
});
