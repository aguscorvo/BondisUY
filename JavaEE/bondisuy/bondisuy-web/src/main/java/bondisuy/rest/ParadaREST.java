package bondisuy.rest;

import java.util.List;

import javax.ejb.EJB;
import javax.enterprise.context.RequestScoped;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import bondisuy.business.IParadaService;
import bondisuy.dto.ProximaLineaDTO;
import bondisuy.exception.BondisUyException;

@RequestScoped
@Path("/paradas")
@Consumes("application/json")
@Produces("application/json")
public class ParadaREST {
	
	@EJB
	IParadaService paradaService;
	
	@GET
	@Path("/{idParada}/{horario}")
	public Response proximasLineas(@PathParam("idParada") Long idParada, @PathParam("horario") String horario) {
		RespuestaREST<List<ProximaLineaDTO>> respuesta = null;
		try {
			List<ProximaLineaDTO> proximasLineas = paradaService.proximasLineas(idParada, horario);
			respuesta = new RespuestaREST<List<ProximaLineaDTO>>(true, "Próximas líneas listadas con éxito", proximasLineas);
			return Response.ok(respuesta).build();
		}catch (BondisUyException e) {
			respuesta = new RespuestaREST<List<ProximaLineaDTO>>(false, e.getLocalizedMessage());
			if(e.getCodigo() == BondisUyException.NO_EXISTE_REGISTRO) {
				return Response.status(Response.Status.BAD_REQUEST).entity(respuesta).build();
			}else {
				return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(respuesta).build();
			}
		}
	}
	

}
