package bondisuy.action;

import java.io.IOException;

import javax.ejb.EJB;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.jboss.logging.Logger;

import bondisuy.business.IAdministradorService;
import bondisuy.dto.AdministradorDTO;
import bondisuy.dto.AdministradorLoginDTO;
import bondisuy.exception.BondisUyException;

/**
 * Servlet implementation class LoginBondisuy
 */
@WebServlet("/LoginBondisuy")
public class LoginBondisuy extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	static Logger logger = Logger.getLogger(LoginBondisuy.class);

	@EJB
	IAdministradorService administrador;
	
	private String FORWARD_PAGE = null;
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public LoginBondisuy() {
        super();
        // TODO Auto-generated constructor stub
    }

	
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		//doGet(request, response);
		/* obtengo la sesión. */
		HttpSession session = request.getSession();
		
		String loginname=request.getParameter("loginName")==null?"":request.getParameter("loginName");
		String loginpassword=request.getParameter("loginPassword")==null?"":request.getParameter("loginPassword");
		
		logger.info(loginpassword);
		
		try {
			AdministradorDTO dtoadmin = administrador.login(new AdministradorLoginDTO(loginname, loginpassword));
			
			String val = loginname;
			Cookie userCookie = new Cookie(getServletContext().getInitParameter("USERCOOKIE"), val);
			userCookie.setMaxAge(60*60*24*365); //Store cookie for 1 year
			userCookie.setPath("/bondisuy-web");
			response.addCookie(userCookie);
			
			session.setAttribute(getServletContext().getInitParameter("USER"), dtoadmin);
			
		} catch (BondisUyException e) {
			logger.info(e.getMessage().trim());
			session.setAttribute("MENSAJE_ERROR_LOGIN", e.getMessage().trim());
		}
		
		/* delego el control a la uri correspondiente. */
		FORWARD_PAGE = "/WEB-INF/jsp/home.jsp";
		request.getRequestDispatcher(FORWARD_PAGE).forward(request, response);

	}

}
