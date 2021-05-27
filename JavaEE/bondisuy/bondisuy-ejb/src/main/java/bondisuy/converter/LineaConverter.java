package bondisuy.converter;

import javax.ejb.EJB;
import javax.ejb.Singleton;

import bondisuy.dto.LineaCrearDTO;
import bondisuy.dto.LineaDTO;
import bondisuy.entity.Linea;

@Singleton
public class LineaConverter extends AbstractConverter<Linea, LineaDTO>{

	@EJB
	private CompaniaConverter companiaConverter;
	
	@EJB
	private RecorridoConverter recorridoConverter;
	
	@Override
	public LineaDTO fromEntity(Linea l) {
		if(l==null) return null;
		return LineaDTO.builder()
				.id(l.getId())
				.nombre(l.getNombre())
				.origen(l.getOrigen())
				.destino(l.getDestino())
				.compania(companiaConverter.fromEntity(l.getCompania()))
				.recorridos(recorridoConverter.fromEntity(l.getRecorridos()))
				.build();
	}
	
	@Override
	public Linea fromDTO(LineaDTO l) {
		if(l==null) return null;
		return Linea.builder()
				.id(l.getId())
				.nombre(l.getNombre())
				.origen(l.getOrigen())
				.destino(l.getDestino())
				.compania(companiaConverter.fromDTO(l.getCompania()))
				.recorridos(recorridoConverter.fromDTO(l.getRecorridos()))
				.build();
	}
	
	public Linea fromCrearDTO(LineaCrearDTO l) {
		if(l==null) return null;
		return Linea.builder()
				.id(l.getId())
				.nombre(l.getNombre())
				.origen(l.getOrigen())
				.destino(l.getDestino())
				.build();
	}
}
