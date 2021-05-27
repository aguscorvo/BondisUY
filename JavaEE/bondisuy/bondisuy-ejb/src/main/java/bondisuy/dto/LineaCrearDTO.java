package bondisuy.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LineaCrearDTO {
	
	private Long id;
	private String nombre;
	private String origen;
	private String destino;
	private Long compania;

}
