package bondisuy.converter;

import java.time.LocalTime;

import javax.ejb.Singleton;

import bondisuy.dto.HorarioCrearDTO;
import bondisuy.dto.HorarioDTO;
import bondisuy.entity.Horario;

@Singleton
public class HorarioConverter extends AbstractConverter<Horario, HorarioDTO>{

	
	@Override
	public HorarioDTO fromEntity(Horario h) {
		if(h==null) return null;
		return HorarioDTO.builder()
				.id(h.getId())
				.hora(h.getHora().toString())
				.build();
	}
	
	@Override
	public Horario fromDTO(HorarioDTO h) {
		if(h==null) return null;
		return Horario.builder()
				.id(h.getId())
				.hora(LocalTime.parse(h.getHora()))
				.build();
	}
	
	public Horario fromCrearDTO(HorarioCrearDTO h) {
		if(h==null) return null;
		return Horario.builder()
				.hora(LocalTime.parse(h.getHora()))
				.build();
	}
}
