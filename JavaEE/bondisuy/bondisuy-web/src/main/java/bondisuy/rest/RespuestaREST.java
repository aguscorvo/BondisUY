package bondisuy.rest;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RespuestaREST<T> {
	
	private Boolean ok;
	private String mensaje;
	private T cuerpo;
	
	public RespuestaREST(Boolean ok, String mensaje){
		this.ok = ok;
		this.mensaje = mensaje;
	}
	
}
