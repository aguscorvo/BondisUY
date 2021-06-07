package bondisuy.dto;

import java.time.LocalTime;

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
public class ProximaLineaDTO {
	
	private String linea;
	private String horario;
	private Long recorrido;
	private String descripcionRecorrido;

}
