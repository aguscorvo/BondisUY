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

import bondisuy.business.IRecorridoService;
import bondisuy.dto.RecorridoCrearDTO;
import bondisuy.dto.RecorridoDTO;
import bondisuy.dto.RecorridoGeomDTO;
import bondisuy.exception.BondisUyException;

@RequestScoped
@Path("/recorridos")
@Consumes("application/json")
@Produces("application/json")
public class RecorridoREST {
	
	@EJB
	IRecorridoService recorridoService;
	
	@GET
	@Path("/{id}")
	public Response listarPorId(@PathParam("id") Long id) {
		RespuestaREST<RecorridoDTO> respuesta = null;
		try {
			RecorridoDTO recorrido = recorridoService.listarPorId(id);
			respuesta = new RespuestaREST<RecorridoDTO>(true, "Recorrido listado con éxito.", recorrido);
			return Response.ok(respuesta).build();
		}catch (BondisUyException e) {
			respuesta = new RespuestaREST<RecorridoDTO>(false, e.getLocalizedMessage());
			if(e.getCodigo() == BondisUyException.NO_EXISTE_REGISTRO) {
				return Response.status(Response.Status.BAD_REQUEST).entity(respuesta).build();
			}else {
				return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(respuesta).build();
			}
		}
	}
	
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
	
	@DELETE
	@Path("/eliminar/{id}")
	public Response eliminar(@PathParam("id") Long id) {
		RespuestaREST<RecorridoDTO> respuesta = null;
		try {
			recorridoService.eliminar(id);
			respuesta = new RespuestaREST<RecorridoDTO>(true, "El recorrido fue eliminado con éxito.");
			return Response.ok(respuesta).build();
		}catch (BondisUyException e) {
			respuesta = new RespuestaREST<RecorridoDTO>(false, e.getLocalizedMessage());
			if(e.getCodigo() == BondisUyException.NO_EXISTE_REGISTRO) {
				return Response.status(Response.Status.BAD_REQUEST).entity(respuesta).build();
			}else {
				return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(respuesta).build();
			}
		}
	}
	
	@PUT
	@Path("/editarGeom")
	public Response editarGeom(RecorridoGeomDTO recorridoGeom) {
		RespuestaREST <RecorridoDTO> respuesta = null;
		try {
			recorridoService.editarGeom(recorridoGeom);
			respuesta = new RespuestaREST<RecorridoDTO>(true, "Recorrido modificado con éxito.");
			return Response.ok(respuesta).build();
		}catch (BondisUyException e) {
			respuesta = new RespuestaREST<RecorridoDTO>(false, e.getLocalizedMessage());
			if(e.getCodigo() == BondisUyException.NO_EXISTE_REGISTRO) {
				return Response.status(Response.Status.BAD_REQUEST).entity(respuesta).build();
			}else {
				return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(respuesta).build();
			}
		}
	}

}
