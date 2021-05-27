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
public class RecorridoMinDTO {

	private Long id;
	private String descripcion;
	private Boolean activo;
	private LineaMinDTO linea;
	
}
