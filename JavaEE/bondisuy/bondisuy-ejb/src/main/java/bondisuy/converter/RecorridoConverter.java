package bondisuy.converter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import javax.ejb.EJB;
import javax.ejb.Singleton;

import bondisuy.dto.RecorridoCrearDTO;
import bondisuy.dto.RecorridoDTO;
import bondisuy.dto.RecorridoMinDTO;
import bondisuy.dto.RecorridoSinLineaDTO;
import bondisuy.entity.Recorrido;

@Singleton
public class RecorridoConverter extends AbstractConverter<Recorrido, RecorridoDTO> {

	@EJB
	LineaConverter lineaConverter;
	
	@EJB
	HorarioConverter horarioConverter;
	
	@Override
	public RecorridoDTO fromEntity(Recorrido r) {
		if (r==null) return null;
		return RecorridoDTO.builder()
				.id(r.getId())
				.descripcion(r.getDescripcion())
				.activo(r.getActivo())
				.fecha(r.getFecha().toString())
				.linea(lineaConverter.fromEntityToMin(r.getLinea()))
				.horarios(horarioConverter.fromEntity(r.getHorarios()))
				.build();
	}
	
	@Override
	public Recorrido fromDTO(RecorridoDTO r) {
		if(r==null) return null;
		DateTimeFormatter formato = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
		return Recorrido.builder()
				.id(r.getId())
				.descripcion(r.getDescripcion())
				.activo(r.getActivo())
				.fecha(LocalDateTime.parse(r.getFecha(), formato))
				.linea(lineaConverter.fromMinDTO(r.getLinea()))
				.horarios(horarioConverter.fromDTO(r.getHorarios()))
				.build();
	}
	
	public Recorrido fromCrearDTO(RecorridoCrearDTO r) {
		if(r==null) return null;
		DateTimeFormatter formato = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
		return Recorrido.builder()
				.descripcion(r.getDescripcion())
				.activo(r.getActivo())
				.fecha(LocalDateTime.parse(r.getFecha(), formato))
				.build();
	}
	
	public RecorridoMinDTO fromEntityToMin (Recorrido r) {
		if(r==null) return null;
		return RecorridoMinDTO.builder()
				.id(r.getId())
				.descripcion(r.getDescripcion())
				.activo(r.getActivo())
				.fecha(r.getFecha().toString())
				.linea(lineaConverter.fromEntityToMin(r.getLinea()))
				.build();
	}
	
	public Recorrido fromMinDTO(RecorridoMinDTO r) {
		if(r==null) return null;
		DateTimeFormatter formato = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
		return Recorrido.builder()
				.id(r.getId())
				.descripcion(r.getDescripcion())
				.activo(r.getActivo())
				.fecha(LocalDateTime.parse(r.getFecha(), formato))
				.linea(lineaConverter.fromMinDTO(r.getLinea()))
				.build();
	}
	
	public RecorridoSinLineaDTO fromEntityToSinLineaDTO(Recorrido r) {
		if(r == null) return null;
		return RecorridoSinLineaDTO.builder()
				.id(r.getId())
				.descripcion(r.getDescripcion())
				.activo(r.getActivo())
				.fecha(r.getFecha().toString())
				.build();
	}
	
	public List<RecorridoSinLineaDTO> fromEntityToSinLineaDTO(List<Recorrido> entities){
		if(entities == null) return null;
		return entities.stream()
			.map(e -> fromEntityToSinLineaDTO(e))
			.collect(Collectors.toList());
	}
	
}
