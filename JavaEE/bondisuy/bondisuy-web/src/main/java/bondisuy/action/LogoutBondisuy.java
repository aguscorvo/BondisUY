package bondisuy.action;

import java.io.IOException;
import java.util.Enumeration;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Servlet implementation class LogoutAction
 */
@WebServlet("/LogoutBondisuy")
public class LogoutBondisuy extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public LogoutBondisuy() {
        super();
        // TODO Auto-generated constructor stub
    }
    
    

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		/* obtengo la sesión. */
		HttpSession session = request.getSession();
		Enumeration<String> enumeration = session.getAttributeNames();

		while (enumeration.hasMoreElements()) {
			String element = (String) enumeration.nextElement();
			session.removeAttribute(element);
		}
				
		/* deshabilito la sessión. */
		session.invalidate();
		request.logout();
		
		/* redirijo el flujo hacia la pagina de inicio. */
		response.sendRedirect("/bondisuy-web/Bondisuy");
	}
	
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}


}
