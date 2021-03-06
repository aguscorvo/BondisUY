package bondisuy.converter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import javax.ejb.EJB;
import javax.ejb.Singleton;

import bondisuy.dto.ParadaCrearDTO;
import bondisuy.dto.ParadaDTO;
import bondisuy.dto.ParadaMinDTO;
import bondisuy.entity.Parada;

@Singleton
public class ParadaConverter extends AbstractConverter<Parada, ParadaDTO>{

	@EJB
	private HorarioConverter horarioConverter;
	
	@Override
	public ParadaDTO fromEntity(Parada p) {
		if (p==null) return null;
		return ParadaDTO.builder()
				.id(p.getId())
				.descripcion(p.getDescripcion())
				.fecha(p.getFecha().toString())
				.codVia1(p.getCodVia1())
				.codVia2(p.getCodVia2())
				.habilitada(p.getHabilitada())
				.horarios(horarioConverter.fromEntity(p.getHorarios()))
				.build();
	}
	
	@Override
	public Parada fromDTO(ParadaDTO p) {
		if (p==null) return null;
		DateTimeFormatter formato = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
		return Parada.builder()
				.id(p.getId())
				.descripcion(p.getDescripcion())
				.fecha(LocalDateTime.parse(p.getFecha(), formato))
				.codVia1(p.getCodVia1())
				.codVia2(p.getCodVia2())
				.habilitada(p.getHabilitada())
				.horarios(horarioConverter.fromDTO(p.getHorarios()))
				.build();
	}
	
	public Parada fromCrearDTO(ParadaCrearDTO p) {
		if(p==null) return null;
		DateTimeFormatter formato = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
		return Parada.builder()
				.descripcion(p.getDescripcion())
				.fecha(LocalDateTime.parse(p.getFecha(), formato))
				.codVia1(p.getCodVia1())
				.codVia2(p.getCodVia2())
				.habilitada(p.getHabilitada())
				.build();
	}
	
	public ParadaMinDTO fromEntityToMin(Parada p) {
		if(p==null) return null;
		return ParadaMinDTO.builder()
				.id(p.getId())
				.descripcion(p.getDescripcion())
				.fecha(p.getFecha().toString())
				.codVia1(p.getCodVia1())
				.codVia2(p.getCodVia2())
				.habilitada(p.getHabilitada())
				.build();	
	}
	
	public Parada fromMinDTO(ParadaMinDTO p) {
		if(p==null) return null;
		DateTimeFormatter formato = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
		return Parada.builder()
				.id(p.getId())
				.descripcion(p.getDescripcion())
				.fecha(LocalDateTime.parse(p.getFecha(), formato))
				.codVia1(p.getCodVia1())
				.codVia2(p.getCodVia2())
				.habilitada(p.getHabilitada())
				.build();
	}
	
}
