package bondisuy.converter;

import javax.ejb.Singleton;

import bondisuy.dto.ParadaCrearDTO;
import bondisuy.dto.ParadaDTO;
import bondisuy.entity.Parada;

@Singleton
public class ParadaConverter extends AbstractConverter<Parada, ParadaDTO>{

	@Override
	public ParadaDTO fromEntity(Parada p) {
		if (p==null) return null;
		return ParadaDTO.builder()
				.id(p.getId())
				.habilitada(p.getHabilitada())
				.build();
	}
	
	@Override
	public Parada fromDTO(ParadaDTO p) {
		if (p==null) return null;
		return Parada.builder()
				.id(p.getId())
				.habilitada(p.getHabilitada())
				.build();
	}
	
	public Parada fromCrearDTO(ParadaCrearDTO p) {
		if(p==null) return null;
		return Parada.builder()
				.habilitada(p.getHabilitada())
				.build();
	}
	
}
