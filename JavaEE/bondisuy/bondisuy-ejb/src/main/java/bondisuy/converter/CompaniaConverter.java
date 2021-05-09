package bondisuy.converter;

import bondisuy.dto.CompaniaCrearDTO;
import bondisuy.dto.CompaniaDTO;
import bondisuy.entity.Compania;

public class CompaniaConverter extends AbstractConverter<Compania, CompaniaDTO> {

	@Override
	public CompaniaDTO fromEntity(Compania e) {
		if(e == null) return null;
		return CompaniaDTO.builder()
				.id(e.getId())
				.nombre(e.getNombre())
				.build();
	}

	@Override
	public Compania fromDTO(CompaniaDTO d) {
		if(d == null) return null;
		return Compania.builder()
				.id(d.getId())
				.nombre(d.getNombre())
				.build();
	}
	
	public Compania fromCrearDTO(CompaniaCrearDTO d) {
		if(d == null) return null;
		return Compania.builder()
				.nombre(d.getNombre())
				.build();
	}
	
}
