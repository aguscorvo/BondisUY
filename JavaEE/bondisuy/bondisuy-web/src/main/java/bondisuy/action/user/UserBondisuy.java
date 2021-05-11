package bondisuy.action.user;

import java.io.IOException;

import javax.ejb.EJB;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.jboss.logging.Logger;

import bondisuy.business.IAdministradorService;
import bondisuy.dto.AdministradorCrearDTO;
import bondisuy.exception.BondisUyException;

/**
 * Servlet implementation class UserBindisuy
 */
@WebServlet("/UserBondisuy")
public class UserBondisuy extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	static Logger logger = Logger.getLogger(UserBondisuy.class);
	
	private String	FORWARD_PAGE 	= null;
    private String actionType = "list";
    
    @EJB
	IAdministradorService administrador;

       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public UserBondisuy() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.sendRedirect("/WEB-INF/Bondisuy");
		
	}
	


	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		
		actionType = "list";
		
		/* obtengo la sesión. */
		HttpSession session = request.getSession();
		
		String username 		= "";
		String nombre 			= "";
		String apellido			= "";
		String password 		= "";
	    
		//elimno de sesion el usuario error de registro si existe
		if(getServletContext().getInitParameter("NORUSER")!=null)
			session.removeAttribute("NORUSER");
		
		/*verifico el tipo de accion*/
		if(request.getParameter("actionType")!=null)
			actionType=request.getParameter("actionType");
			
		if(actionType.equalsIgnoreCase("addUser")) {
			username		= request.getParameter("signupNickName");
			nombre			= request.getParameter("signupName");
			apellido		= request.getParameter("signupApellido");
			password		= request.getParameter("signupPassword");
		
			AdministradorCrearDTO nuser = new AdministradorCrearDTO(nombre, apellido, username, password);
			
			try {
				administrador.crear(nuser);
			} catch (BondisUyException e) {
				session.setAttribute("NORUSER", nuser);
				session.setAttribute("MENSAJE_ERROR_REGISTER", e.getMessage().trim());
				
			}
			FORWARD_PAGE = "/WEB-INF/jsp/home.jsp";
			 /* delego el control a la uri correspondiente. */
			request.getRequestDispatcher(FORWARD_PAGE).forward(request, response);
			
	
		}	
		
	}
		
}
