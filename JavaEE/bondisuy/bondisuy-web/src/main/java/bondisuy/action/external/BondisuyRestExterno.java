package bondisuy.action.external;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.enterprise.context.RequestScoped;
import javax.naming.NamingException;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.primefaces.shaded.json.JSONArray;
import org.primefaces.shaded.json.JSONObject;

import bondisuy.action.external.dto.CalleDTO;
import bondisuy.action.external.dto.PuntoDTO;

@RequestScoped
@Path("servicios")
@Consumes(MediaType.APPLICATION_JSON)
@Produces({ MediaType.APPLICATION_JSON })
public class BondisuyRestExterno {
	final Logger log = Logger.getLogger(BondisuyRestExterno.class.getName());

	public BondisuyRestExterno() throws NamingException {
	}

	@GET
	@Path("/srchservicio/calle/{param}")
	public List<CalleDTO> getCalleIM(@PathParam("param") String param) {

		List<CalleDTO> dtres = null;
		String key = null;
		String redirect_url = null;

		key = "&user_key=29e11a5caf81cb81d692977bd84b4287";
		redirect_url = "http://www.montevideo.gub.uy/ubicacionesRest/calles/?nombre=" + param;

		dtres = getInfoRest(redirect_url);

		return dtres;
	}

	@GET
	@Path("/srchservicio/cruza/{idcalle}/{nombre}")
	public List<CalleDTO> getCalleCruza(@PathParam("idcalle") String idcalle, @PathParam("nombre") String nombre ) {

		List<CalleDTO> dtres = null;
		String key = null;
		String redirect_url = null;

		key = "&user_key=29e11a5caf81cb81d692977bd84b4287";
		redirect_url = "http://www.montevideo.gub.uy/ubicacionesRest/cruces/"+ idcalle +"/?nombre=" +(nombre.equalsIgnoreCase("ALL")?"":nombre).trim();

		dtres = getInfoRest(redirect_url);

		return dtres;
	}

	@GET
	@Path("/srchservicio/cruce/{idcalle1}/{idcalle2}")
	public PuntoDTO getCalleCrucePunto(@PathParam("idcalle1") String idcalle1, @PathParam("idcalle2") String idcalle2) {

		PuntoDTO dtres = null;
		String key = null;
		String redirect_url = null;

		key = "&user_key=29e11a5caf81cb81d692977bd84b4287";
		redirect_url = "http://www.montevideo.gub.uy/ubicacionesRest/esquina/"+ idcalle1 +"/" +idcalle2;

		dtres = getPtoInfoRest(redirect_url);

		return dtres;
	}

	@GET
	@Path("/srchservicio/direccion/{idcalle}/{numero}")
	public PuntoDTO getDireccionPunto(@PathParam("idcalle") String idcalle, @PathParam("numero") String numero) {

		PuntoDTO dtres = null;
		String key = null;
		String redirect_url = null;

		key = "&user_key=29e11a5caf81cb81d692977bd84b4287";
		redirect_url = "http://www.montevideo.gub.uy/ubicacionesRest/direccion/"+ idcalle +"/" +numero;

		dtres = getPtoInfoRest(redirect_url);

		return dtres;
	}

	
	
	private List<CalleDTO> getInfoRest(String redirect_url) {
		List<CalleDTO> dtres = new ArrayList<CalleDTO>();

		try {
			HttpRequest request = HttpRequest.newBuilder().uri(URI.create(redirect_url))
					.method("GET", HttpRequest.BodyPublishers.noBody()).setHeader("User-Agent", "TSE2021").build();

			HttpResponse<String> response = HttpClient.newHttpClient().send(request,
					HttpResponse.BodyHandlers.ofString());
			JSONArray arr = new JSONArray(response.body());

			for (int i = 0; i < arr.length(); i++) {
				CalleDTO cdto = new CalleDTO(arr.getJSONObject(i).getLong("codigo"),
						arr.getJSONObject(i).getString("nombre"), arr.getJSONObject(i).getString("descTipo"));

				dtres.add(cdto);
			}

		} catch (IOException | InterruptedException e) {
			log.info(e.getMessage());
		}
		return dtres;
	}

	private PuntoDTO getPtoInfoRest(String redirect_url) {
		PuntoDTO dtres = new PuntoDTO();

		try {
			HttpRequest request = HttpRequest.newBuilder().uri(URI.create(redirect_url))
					.method("GET", HttpRequest.BodyPublishers.noBody()).setHeader("User-Agent", "TSE2021").build();

			HttpResponse<String> response = HttpClient.newHttpClient().send(request,
					HttpResponse.BodyHandlers.ofString());
			
			JSONObject obj = new JSONObject(response.body());
			
			if(obj.has("geoJSON")) {
				JSONObject geo = obj.getJSONObject("geoJSON");
				JSONArray arr = new JSONArray(geo.getJSONArray("coordinates"));
				
				dtres.setX(arr.getDouble(0));
				dtres.setY(arr.getDouble(1));
				
			}
		
		} catch (IOException | InterruptedException e) {
			log.info(e.getMessage());
		}
		return dtres;
	}

}
