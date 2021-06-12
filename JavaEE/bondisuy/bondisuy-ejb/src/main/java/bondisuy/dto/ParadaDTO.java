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
public class ParadaDTO {

	private Long id;
	private String descripcion;
	private String fecha;
	private Long codVia1;
	private Long codVia2;
	private Boolean habilitada;
	private List<HorarioDTO> horarios;
}
