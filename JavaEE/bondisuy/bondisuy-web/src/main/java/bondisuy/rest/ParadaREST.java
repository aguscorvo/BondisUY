package bondisuy.rest;

import java.util.List;

import javax.ejb.EJB;
import javax.enterprise.context.RequestScoped;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import bondisuy.business.IParadaService;
import bondisuy.dto.ParadaCrearDTO;
import bondisuy.dto.ParadaDTO;
import bondisuy.dto.ProximaLineaDTO;
import bondisuy.exception.BondisUyException;

@RequestScoped
@Path("/paradas")
@Consumes("application/json")
@Produces("application/json")
public class ParadaREST {
	
	@EJB
	IParadaService paradaService;
	
	@POST
	public Response crear(ParadaCrearDTO request) {
		RespuestaREST<ParadaDTO> respuesta =null;
		try {
			ParadaDTO parada = paradaService.crear(request);
			respuesta = new RespuestaREST<ParadaDTO>(true, "Parada creada con éxito.", parada);
			return Response.ok(respuesta).build();
		}catch(BondisUyException e) {
			respuesta = new RespuestaREST<ParadaDTO>(false, e.getLocalizedMessage());
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(respuesta).build();
		}		
	}
	
	@GET
	@Path("/{idParada}/{hora}")
	public Response proximasLineas(@PathParam("idParada") Long idParada, @PathParam("hora") String horario) {
		RespuestaREST<List<ProximaLineaDTO>> respuesta = null;
		try {
			//String horario = hora + ":" + min + ":" + "00";
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
	
	@DELETE
	@Path("/eliminarHorarios/{parada}/{recorrido}")
	public Response eliminarHorarios(@PathParam("parada") Long parada, @PathParam("recorrido") Long recorrido){
		RespuestaREST <ParadaDTO> respuesta = null;
		try {
			paradaService.eliminarHorarios(parada, recorrido);
			respuesta = new RespuestaREST<ParadaDTO>(true, "Los horarios asociados a la parada y recorrido indicados fueron"
					+ "eliminados con éxito.");
			return Response.ok(respuesta).build();
		}catch (BondisUyException e) {
			respuesta = new RespuestaREST<ParadaDTO>(false, e.getLocalizedMessage());
			if(e.getCodigo() == BondisUyException.NO_EXISTE_REGISTRO) {
				return Response.status(Response.Status.BAD_REQUEST).entity(respuesta).build();
			}else {
				return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(respuesta).build();
			}
		}		
	}
	

}
