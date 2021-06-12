package bondisuy.dto;

import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Setter;
import lombok.Getter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RecorridoSinLineaDTO {
	
	private Long id;
	private String descripcion;
	private Boolean activo;
	private String fecha;

}
