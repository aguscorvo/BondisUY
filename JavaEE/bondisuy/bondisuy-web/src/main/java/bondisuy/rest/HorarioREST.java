package bondisuy.rest;

import javax.ejb.EJB;
import javax.enterprise.context.RequestScoped;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import bondisuy.business.IHorarioService;
import bondisuy.dto.HorarioCrearDTO;
import bondisuy.dto.HorarioDTO;
import bondisuy.exception.BondisUyException;

@RequestScoped
@Path("/horarios")
@Consumes("application/json")
@Produces("application/json")
public class HorarioREST {
	
	@EJB
	IHorarioService horarioService;
	
	@POST
	public Response crear(HorarioCrearDTO request) {
		RespuestaREST<HorarioDTO> respuesta =null;
		try {
			HorarioDTO horario = horarioService.crear(request);
			respuesta = new RespuestaREST<HorarioDTO>(true, "Horario creado con éxito.", horario);
			return Response.ok(respuesta).build();
		}catch(BondisUyException e) {
			respuesta = new RespuestaREST<HorarioDTO>(false, e.getLocalizedMessage());
			if(e.getCodigo()==BondisUyException.NO_EXISTE_REGISTRO) {
				return Response.status(Response.Status.BAD_REQUEST).entity(respuesta).build();
			}			
			else{
				return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(respuesta).build();
			}
		}		
	}

}
