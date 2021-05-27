package bondisuy.dto;

import java.util.List;

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
public class RecorridoDTO {

	private Long id;
	private String descripcion;
	private Boolean activo;
	private LineaMinDTO linea;
	private List<HorarioDTO> horarios;
}
