package bondisuy.rest;

import javax.ejb.EJB;
import javax.enterprise.context.RequestScoped;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import bondisuy.business.IRecorridoService;
import bondisuy.dto.RecorridoCrearDTO;
import bondisuy.dto.RecorridoDTO;
import bondisuy.exception.BondisUyException;

@RequestScoped
@Path("/recorridos")
@Consumes("application/json")
@Produces("application/json")
public class RecorridoREST {
	
	@EJB
	IRecorridoService recorridoService;
	
	@POST
	public Response crear(RecorridoCrearDTO request) {
		RespuestaREST<RecorridoDTO> respuesta =null;
		try {
			RecorridoDTO recorrido = recorridoService.crear(request);
			respuesta = new RespuestaREST<RecorridoDTO>(true, "Recorrido creado con éxito.", recorrido);
			return Response.ok(respuesta).build();
		}catch(BondisUyException e) {
			respuesta = new RespuestaREST<RecorridoDTO>(false, e.getLocalizedMessage());
			if(e.getCodigo()==BondisUyException.NO_EXISTE_REGISTRO) {
				return Response.status(Response.Status.BAD_REQUEST).entity(respuesta).build();
			}			
			else{
				return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(respuesta).build();
			}
		}		
	}

}
