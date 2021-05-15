package bondisuy.action.external.dto;


public class CalleDTO {

	Long codigo;
	String nombre;
	String tipo;
	
	
	public CalleDTO() {
	}
	
	
	
	public CalleDTO(Long codigo, String nombre, String tipo) {
		this.codigo = codigo;
		this.nombre = nombre;
		this.tipo = tipo;
	}



	public Long getCodigo() {
		return codigo;
	}
	public void setCodigo(Long codigo) {
		this.codigo = codigo;
	}
	public String getNombre() {
		return nombre;
	}
	public void setNombre(String nombre) {
		this.nombre = nombre;
	}
	public String getTipo() {
		return tipo;
	}
	public void setTipo(String tipo) {
		this.tipo = tipo;
	}
	
	
}
