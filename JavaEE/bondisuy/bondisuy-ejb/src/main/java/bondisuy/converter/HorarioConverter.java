package bondisuy.converter;

import java.time.LocalTime;

import javax.ejb.EJB;
import javax.ejb.Singleton;

import bondisuy.dto.HorarioCrearDTO;
import bondisuy.dto.HorarioDTO;
import bondisuy.entity.Horario;

@Singleton
public class HorarioConverter extends AbstractConverter<Horario, HorarioDTO>{

	@EJB
	private RecorridoConverter recorridoConverter;
	
	@EJB
	private ParadaConverter paradaConverter;
	
	@Override
	public HorarioDTO fromEntity(Horario h) {
		if(h==null) return null;
		return HorarioDTO.builder()
				.id(h.getId())
				.hora(h.getHora().toString())
				.recorrido(recorridoConverter.fromEntity(h.getRecorrido()))
				.parada(paradaConverter.fromEntity(h.getParada()))
				.build();
	}
	
	@Override
	public Horario fromDTO(HorarioDTO h) {
		if(h==null) return null;
		return Horario.builder()
				.id(h.getId())
				.hora(LocalTime.parse(h.getHora()))
				.recorrido(recorridoConverter.fromDTO(h.getRecorrido()))
				.parada(paradaConverter.fromDTO(h.getParada()))
				.build();
	}
	
	public Horario fromCrearDTO(HorarioCrearDTO h) {
		if(h==null) return null;
		return Horario.builder()
				.hora(LocalTime.parse(h.getHora()))
				.build();
	}
}
