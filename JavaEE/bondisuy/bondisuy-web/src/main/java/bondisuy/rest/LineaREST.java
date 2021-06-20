package bondisuy.rest;

import javax.ejb.EJB;
import javax.enterprise.context.RequestScoped;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
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
	
	@GET
	@Path("/{id}")
	public Response listarPorId(@PathParam("id") Long id) {
		RespuestaREST<LineaDTO> respuesta = null;
		try {
			LineaDTO linea = lineaService.listarPorId(id);
			respuesta = new RespuestaREST<LineaDTO>(true, "Línea listada con éxito.", linea);
			return Response.ok(respuesta).build();
		}catch (BondisUyException e) {
			respuesta = new RespuestaREST<LineaDTO>(false, e.getLocalizedMessage());
			if(e.getCodigo() == BondisUyException.NO_EXISTE_REGISTRO) {
				return Response.status(Response.Status.BAD_REQUEST).entity(respuesta).build();
			}else {
				return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(respuesta).build();
			}
		}
	}
	
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
	
	@PUT
	@Path("/editar/{id}")
	public Response editar(@PathParam("id") Long id, LineaCrearDTO request) {
		RespuestaREST<LineaDTO> respuesta =null;
		try {
			LineaDTO linea = lineaService.editar(id, request);
			respuesta = new RespuestaREST<LineaDTO>(true, "Linea editar con éxito.", linea);
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
	
	@DELETE
	@Path("/eliminar/{id}")
	public Response eliminar(@PathParam("id") Long id) {
		RespuestaREST<LineaDTO> respuesta =null;
		try {
			lineaService.eliminar(id);
			respuesta = new RespuestaREST<LineaDTO>(true, "Linea eliminada con éxito.");
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
