package bondisuy.exception;

import java.io.Serializable;

public class BondisUyException extends Exception implements Serializable {

	private static final long serialVersionUID = 1L;
	
	/* Códigos de excepción */
	public static final int EXISTE_REGISTRO = 1;
	public static final int NO_EXISTE_REGISTRO = 2;
	public static final int DATOS_INCORRECTOS = 3;
	public static final int ERROR_GENERAL = 4;

	/* Codigo de la excepción */
	private final int codigo;

	public BondisUyException(int codigo) {
		super();
		this.codigo = codigo;
	}

	public BondisUyException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace, int codigo) {
		super(message, cause, enableSuppression, writableStackTrace);
		this.codigo = codigo;
	}

	public BondisUyException(String message, Throwable cause, int codigo) {
		super(message, cause);
		this.codigo = codigo;
	}

	public BondisUyException(String message, int codigo) {
		super(message);
		this.codigo = codigo;
	}

	public BondisUyException(Throwable cause, int codigo) {
		super(cause);
		this.codigo = codigo;
	}

}
