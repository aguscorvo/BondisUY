package bondisuy.action.linea;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import javax.ejb.EJB;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jboss.logging.Logger;

import com.fasterxml.jackson.databind.ObjectMapper;

import bondisuy.business.ILineaService;
import bondisuy.dto.LineaDTO;
import bondisuy.dto.LineaMinDTO;
import bondisuy.exception.BondisUyException;

/**
 * Servlet implementation class LineaBondisuy
 */
@WebServlet("/LineaBondisuy")
public class LineaBondisuy extends HttpServlet {
	private static final long serialVersionUID = 1L;

	static Logger logger = Logger.getLogger(LineaBondisuy.class);
	
	@EJB
	ILineaService linea;
	
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public LineaBondisuy() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		/*verifico el tipo de accion*/
		if(request.getParameter("lineaId")!=null) {
			LineaDTO lin = null;
			
			try {
				lin = linea.listarPorId(Long.valueOf(request.getParameter("lineaId")));
			} catch (NumberFormatException | BondisUyException e) {
				logger.info(e.getMessage().trim());
			}
			
			if(lin!=null) {
				//Creating the ObjectMapper object
				ObjectMapper mapper = new ObjectMapper();
				//Converting the Object to JSONString
				String jsonString = mapper.writeValueAsString(lin);
				
				PrintWriter salida = response.getWriter();
				response.setContentType("application/json");
				response.setCharacterEncoding("UTF-8");
				salida.print(jsonString);
				salida.flush();
			}else {
				response.getWriter();
			}
						
		} else if(request.getParameter("companyId")!=null){
			try {
				List<LineaMinDTO> lineas= null;
				String parametro = request.getParameter("companyId");
				
				if(parametro.equals("ALL")) {
					lineas = linea.listar();
				} else {
					lineas = linea.listarPorCompania(Long.valueOf(parametro));
				}
				
				//Creating the ObjectMapper object
				ObjectMapper mapper = new ObjectMapper();
				//Converting the Object to JSONString
				String jsonString = mapper.writeValueAsString(lineas);
				
				PrintWriter salida = response.getWriter();
				response.setContentType("application/json");
				response.setCharacterEncoding("UTF-8");
				salida.print(jsonString);
				salida.flush();
			} catch (Exception e) {
				e.printStackTrace();
				response.getWriter();
			}
		} else if(request.getParameter("lineaName")!=null) {
			logger.info(request.getParameter("lineaName"));
			List<LineaMinDTO> llin= null;
			try {
				llin = linea.listar();
			} catch (NumberFormatException | BondisUyException e) {
				logger.info(e.getMessage().trim());
				
			}
			
			if(llin!=null) {
				
				
				List<LineaMinDTO> aux = new ArrayList<LineaMinDTO>();
				for (LineaMinDTO lin: llin) {
					if(lin.getNombre().contains(request.getParameter("lineaName"))) {
						aux.add(lin);
					}
				}	
			
				//Creating the ObjectMapper object
				ObjectMapper mapper = new ObjectMapper();
				//Converting the Object to JSONString
				String jsonString = mapper.writeValueAsString(aux);
				
				PrintWriter salida = response.getWriter();
				response.setContentType("application/json");
				response.setCharacterEncoding("UTF-8");
				salida.print(jsonString);
				salida.flush();
			}else {
				response.getWriter();
			}

			
		}else {
			response.getWriter();
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
