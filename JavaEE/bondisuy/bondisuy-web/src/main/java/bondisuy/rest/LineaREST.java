package bondisuy.rest;

import javax.ejb.EJB;
import javax.enterprise.context.RequestScoped;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import bondisuy.business.ILineaService;
import bondisuy.dto.LineaCrearDTO;
import bondisuy.dto.LineaDTO;
import bondisuy.exception.BondisUyException;

@RequestScoped
@Path("/lineas")
@Consumes("application/json")
@Produces("application/json")
public class LineaREST {
	
	@EJB
	ILineaService lineaService;
	
	@POST
	public Response crear(LineaCrearDTO request) {
		RespuestaREST<LineaDTO> respuesta =null;
		try {
			LineaDTO linea = lineaService.crear(request);
			respuesta = new RespuestaREST<LineaDTO>(true, "Linea creada con éxito.", linea);
			return Response.ok(respuesta).build();
		}catch(BondisUyException e) {
			respuesta = new RespuestaREST<LineaDTO>(false, e.getLocalizedMessage());
			if(e.getCodigo()==BondisUyException.NO_EXISTE_REGISTRO) {
				return Response.status(Response.Status.BAD_REQUEST).entity(respuesta).build();
			}			
			else{
				return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(respuesta).build();
			}
		}		
	}

}
