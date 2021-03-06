package bondisuy.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RecorridoCrearDTO {

	private String descripcion;
	private Boolean activo;
	private String fecha;
	private Long linea;
	private String geometria;

}
