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
public class HorarioDTO {
	
	private String hora;
	private RecorridoMinDTO recorrido;
	private ParadaMinDTO parada;

}
