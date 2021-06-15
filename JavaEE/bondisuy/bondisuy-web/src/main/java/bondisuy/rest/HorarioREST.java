package bondisuy.rest;

import java.util.List;

import javax.ejb.EJB;
import javax.enterprise.context.RequestScoped;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
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
	
	@GET
	@Path("/listarPorParadaYRecorrido/{parada}/{recorrido}")
	public Response listarPorParadaYRecorrido(@PathParam("parada") Long parada, @PathParam("recorrido") Long recorrido) {
		RespuestaREST<List<Long>> respuesta = null;
		try {
			List<Long> horarios = horarioService.listarPorParadaYRecorrido(parada, recorrido);
			respuesta = new RespuestaREST<List<Long>>(true, "Horarios listados con éxito.", horarios);
			return Response.ok(respuesta).build();
		}catch(BondisUyException e) {
			respuesta = new RespuestaREST<List<Long>>(false, e.getLocalizedMessage());
			if(e.getCodigo()==BondisUyException.NO_EXISTE_REGISTRO) {
				return Response.status(Response.Status.BAD_REQUEST).entity(respuesta).build();
			}			
			else{
				return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(respuesta).build();
			}
		}	
	}
	
	@PUT
	@Path("/editar/{id}")
	public Response editar(@PathParam("id") Long id, HorarioCrearDTO horarioDTO) {
		RespuestaREST<HorarioDTO> respuesta = null;
		try {
			HorarioDTO horario = horarioService.editar(id, horarioDTO);
			respuesta = new RespuestaREST<HorarioDTO>(true, "Horario editado con éxito.", horario);
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
