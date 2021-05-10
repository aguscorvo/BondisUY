package bondisuy.converter;

import javax.ejb.Singleton;

import bondisuy.dto.AdministradorCrearDTO;
import bondisuy.dto.AdministradorDTO;
import bondisuy.dto.AdministradorLoginDTO;
import bondisuy.entity.Administrador;

@Singleton
public class AdministradorConverter extends AbstractConverter<Administrador, AdministradorDTO>{

	@Override
	public AdministradorDTO fromEntity(Administrador a) {
		if(a==null) return null;
		return AdministradorDTO.builder()
				.id(a.getId())
				.nombre(a.getNombre())
				.apellido(a.getApellido())
				.username(a.getUsername())
				.build();
	}
	
	@Override
	public Administrador fromDTO(AdministradorDTO a) {
		if(a==null) return null;
		return Administrador.builder()
				.id(a.getId())
				.nombre(a.getNombre())
				.apellido(a.getApellido())
				.username(a.getUsername())
				.build();
	}
	
	public Administrador fromCrearDTO(AdministradorCrearDTO a) {
		if(a==null) return null;
		return Administrador.builder()
				.nombre(a.getNombre())
				.apellido(a.getApellido())
				.username(a.getUsername())
				.password(a.getPassword())
				.build();
	}
	
	
	
}
