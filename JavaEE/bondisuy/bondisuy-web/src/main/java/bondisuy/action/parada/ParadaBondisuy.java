package bondisuy.action.parada;

import java.io.IOException;
import java.io.PrintWriter;

import javax.ejb.EJB;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jboss.logging.Logger;

import com.fasterxml.jackson.databind.ObjectMapper;

import bondisuy.business.IParadaService;
import bondisuy.dto.ParadaDTO;
import bondisuy.exception.BondisUyException;

/**
 * Servlet implementation class ParadaBondisuy
 */
@WebServlet("/ParadaBondisuy")
public class ParadaBondisuy extends HttpServlet {
	private static final long serialVersionUID = 1L;

	static Logger logger = Logger.getLogger(ParadaBondisuy.class);

	@EJB
	IParadaService pservice;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public ParadaBondisuy() {
		super();
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		/* verifico el tipo de accion */
		if (request.getParameter("paradaId") != null) {
			ParadaDTO parada = null;

			try {
				parada = pservice.listarPorId(Long.valueOf(request.getParameter("paradaId")));
			} catch (NumberFormatException e) {
				logger.info(e.getMessage().trim());
			} catch (BondisUyException e) {
				logger.info(e.getMessage().trim());
			}

			if (parada != null) {
				// Creating the ObjectMapper object
				ObjectMapper mapper = new ObjectMapper();
				// Converting the Object to JSONString
				String jsonString = mapper.writeValueAsString(parada);

				PrintWriter salida = response.getWriter();
				response.setContentType("application/json");
				response.setCharacterEncoding("UTF-8");
				salida.print(jsonString);
				salida.flush();
			} else {
				response.getWriter();
			}
		} else {
			response.getWriter();
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doGet(request, response);
	}

}
