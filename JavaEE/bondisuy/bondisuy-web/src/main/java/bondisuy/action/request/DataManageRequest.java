package bondisuy.action.request;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

public class DataManageRequest {
public static String dateToStr(Date fecha){
		
		SimpleDateFormat sdf 	= new SimpleDateFormat("yyyy-MM-dd");
		
		return sdf.format(fecha);
	}
	
	public static String longDateToStr(Long lfecha){
		
		Date fecha = new Date(lfecha);
		SimpleDateFormat sdf 	= new SimpleDateFormat("yyyy-MM-dd");
		
		return sdf.format(fecha);
	}
	
	
	public static Integer listSize(List<Object> lista) {
		return lista.size();
	}
	
	public static String cutStr(String cadena, Integer largo){
		
		if(cadena.length()<largo)
			return cadena;
		
		return cadena.substring(0, largo).concat("...");
	}
	
}
