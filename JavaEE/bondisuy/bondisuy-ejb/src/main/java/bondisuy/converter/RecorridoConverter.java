package bondisuy.converter;

import javax.ejb.Singleton;

import bondisuy.dto.RecorridoCrearDTO;
import bondisuy.dto.RecorridoDTO;
import bondisuy.entity.Recorrido;

@Singleton
public class RecorridoConverter extends AbstractConverter<Recorrido, RecorridoDTO> {

	@Override
	public RecorridoDTO fromEntity(Recorrido r) {
		if (r==null) return null;
		return RecorridoDTO.builder()
				.id(r.getId())
				.activo(r.getActivo())
				.build();
	}
	
	@Override
	public Recorrido fromDTO(RecorridoDTO r) {
		if(r==null) return null;
		return Recorrido.builder()
				.id(r.getId())
				.activo(r.getActivo())
				.build();
	}
	
	public Recorrido fromCrearDTO(RecorridoCrearDTO r) {
		if(r==null) return null;
		return Recorrido.builder()
				.activo(r.getActivo())
				.build();
	}
	
}
