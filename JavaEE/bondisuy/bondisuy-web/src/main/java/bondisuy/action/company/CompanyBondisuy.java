package bondisuy.action.company;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.ejb.EJB;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jboss.logging.Logger;

import com.fasterxml.jackson.databind.ObjectMapper;

import bondisuy.business.ICompaniaService;
import bondisuy.dto.CompaniaDTO;
import bondisuy.exception.BondisUyException;

/**
 * Servlet implementation class CompanyBondisuy
 */
@WebServlet("/CompanyBondisuy")
public class CompanyBondisuy extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	static Logger logger = Logger.getLogger(CompanyBondisuy.class);
	
	@EJB
	ICompaniaService compania;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public CompanyBondisuy() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		/*verifico el tipo de accion*/
		if(request.getParameter("companyId")!=null){
			List<CompaniaDTO> lcom= null;
			CompaniaDTO com = null;
			//Creating the ObjectMapper object
			ObjectMapper mapper = new ObjectMapper();
			String jsonString = null;
			PrintWriter salida = null;
			
			try {
				if(request.getParameter("companyId").equalsIgnoreCase("ALL")) {
					lcom = compania.listar();	
					if(lcom!=null) {
						//Converting the Object to JSONString
						jsonString = mapper.writeValueAsString(lcom);
					} else {
						response.getWriter();
					}

				}else {
					com = compania.listarPorId(Long.valueOf(request.getParameter("companyId")));
					if(com !=null) {
						jsonString = mapper.writeValueAsString(com);
					} else {
						response.getWriter();
					}
				}

				salida = response.getWriter();
				response.setContentType("application/json");
				response.setCharacterEncoding("UTF-8");
				salida.print(jsonString);
				salida.flush();	

			} catch (NumberFormatException | BondisUyException e) {
				logger.info(e.getMessage().trim());
		
			}
		} else {
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
