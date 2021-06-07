package bondisuy.action;

import java.io.IOException;
import java.util.Enumeration;
import java.util.List;

import javax.ejb.EJB;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.jboss.logging.Logger;

import bondisuy.business.IAdministradorService;
import bondisuy.business.ICompaniaService;
import bondisuy.business.ILineaService;
import bondisuy.dto.AdministradorCrearDTO;
import bondisuy.dto.CompaniaDTO;
import bondisuy.dto.LineaDTO;
import bondisuy.dto.LineaMinDTO;
import bondisuy.exception.BondisUyException;

/**
 * Servlet implementation class Bondisuy
 */
@WebServlet("/Bondisuy")
public class Bondisuy extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	@EJB
	ICompaniaService compania;
	
	@EJB
	ILineaService linea;
	
	@EJB
	IAdministradorService administrador;
	
	
	private String FORWARD_PAGE = null;
	private String actionType = "list";
    
	static Logger logger = Logger.getLogger(Bondisuy.class);
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Bondisuy() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        crearAdmin();
        
		/* obtengo la sesion. */
		HttpSession session = request.getSession();
		Enumeration<String> enumeration = session.getAttributeNames();
		
		/*se borrran las variables de sesion*/
		while (enumeration.hasMoreElements()) {
			String element = (String) enumeration.nextElement();
			if(!(element.equals("MENSAJE_ERROR_REGISTER")))
				session.removeAttribute(element);
		}
		actionType = "list";
		
		/* verifico el tipo de accion */
		if (request.getParameter("actionType") != null)
			actionType = request.getParameter("actionType");

		if (actionType.equalsIgnoreCase("list")) {
			List<LineaMinDTO> lenf = null;
			List<CompaniaDTO> lcom = null;
			try {
				lenf = linea.listar();
			} catch (BondisUyException e) {
				// TODO Auto-generated catch block
				logger.info(e.getMessage().trim());
				session.setAttribute("MENSAJE_ERROR_REGISTER", e.getMessage().trim());
			}
			
			try {
				lcom = compania.listar();
			} catch (BondisUyException e) {
				// TODO Auto-generated catch block
				logger.info(e.getMessage().trim());
				session.setAttribute("MENSAJE_ERROR_REGISTER", e.getMessage().trim());
			}

				request.setAttribute("LINEAS", lenf);
				request.setAttribute("COMPANYS", lcom);
			
		}
		
		/* delego el control a la uri correspondiente. */
		FORWARD_PAGE = "/WEB-INF/jsp/index.jsp";
		request.getRequestDispatcher(FORWARD_PAGE).forward(request, response);

		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

	private void crearAdmin() {
		try {
			administrador.crear(new AdministradorCrearDTO("Marcos", "Pulido", "marcos.pulido", "1234" ));
		} catch (BondisUyException e) {
			logger.info(e.getMessage().trim());
		}
	}
}
