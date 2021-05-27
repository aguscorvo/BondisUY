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
public class ParadaMinDTO {

	private Long id;
	private String descripcion;
	private Long codVia1;
	private Long codVia2;
	private Boolean habilitada;
	
}
