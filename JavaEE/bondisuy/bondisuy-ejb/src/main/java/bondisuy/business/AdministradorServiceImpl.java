package bondisuy.business;

import java.util.List;

import javax.ejb.EJB;
import javax.ejb.Stateless;

import at.favre.lib.crypto.bcrypt.BCrypt;
import bondisuy.converter.AdministradorConverter;
import bondisuy.dao.IAdministradorDAO;
import bondisuy.dto.AdministradorCrearDTO;
import bondisuy.dto.AdministradorDTO;
import bondisuy.dto.AdministradorLoginDTO;
import bondisuy.entity.Administrador;
import bondisuy.exception.BondisUyException;


@Stateless
public class AdministradorServiceImpl implements IAdministradorService {

	@EJB
	private IAdministradorDAO administradorDAO;
	
	@EJB
	private AdministradorConverter administradorConverter;
	
	@Override
	public List<AdministradorDTO> listar() throws BondisUyException{
		try {
			return administradorConverter.fromEntity(administradorDAO.listar());
		}catch(Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
	
	@Override
	public AdministradorDTO listarPorId(Long id) throws BondisUyException{
		return null;
	}
	
	@Override
	public AdministradorDTO listarPorUsername(String username) throws BondisUyException{
		return null;
	}
	
	@Override
	public AdministradorDTO crear(AdministradorCrearDTO administradorDTO) throws BondisUyException{
		//se valida que el username sea unico
		Administrador administrador = administradorConverter.fromCrearDTO(administradorDTO);
		if(administradorDAO.listarPorUsername(administrador.getUsername()) != null) {
			throw new BondisUyException("El username ya se encuentra en uso.", BondisUyException.EXISTE_REGISTRO);
		}else {
			try {
				// se encripta la contraseña
				administrador.setPassword(BCrypt.withDefaults().hashToString(12, administrador.getApellido().toCharArray()));
				return administradorConverter.fromEntity(administradorDAO.crear(administrador));
			}catch(Exception e) {
				throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
			}
		}	
	}
	
	@Override
	public AdministradorDTO editar(Long id, AdministradorCrearDTO administradorDTO) throws BondisUyException{
		// se valida que exista el administrador
		Administrador administrador = administradorDAO.listarPorId(id);
		if(administrador ==null) {
			throw new BondisUyException("El administrador indicado no existe.", BondisUyException.NO_EXISTE_REGISTRO);
		} //si el administrador desea actualizar username se verifica que no exista
		else if(!administrador.getUsername().equalsIgnoreCase(administradorDTO.getUsername())){
			if(administradorDAO.listarPorUsername(administradorDTO.getUsername()) != null){
				throw new BondisUyException("El username indicado ya se encuentra en uso.", BondisUyException.EXISTE_REGISTRO);
			}	
		}
		try {
			administrador.setNombre(administradorDTO.getNombre());
			administrador.setApellido(administradorDTO.getApellido());
			administrador.setUsername(administradorDTO.getUsername());
			return administradorConverter.fromEntity(administradorDAO.editar(administrador));
		}catch(Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
	
	@Override
	public void eliminar(Long id) throws BondisUyException{
		// Se valida que exista el administrador
		Administrador administrador = administradorDAO.listarPorId(id);
		if(administrador ==null) {
			throw new BondisUyException("El administrador indicado no existe.", BondisUyException.NO_EXISTE_REGISTRO);
		}else {
			try {
				administradorDAO.eliminar(administrador);
			}catch(Exception e) {
				throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
			}
		}
	}
	
	@Override
	public AdministradorDTO login(AdministradorLoginDTO administradorDTO) throws BondisUyException{
		// se valida que exista el username
		Administrador administrador = administradorDAO.listarPorUsername(administradorDTO.getUsername());
		if(administrador==null) {
			throw new BondisUyException("El username indicado no existe.", BondisUyException.DATOS_INCORRECTOS);
		}else {
			// se valida la contraseña
			BCrypt.Result resultado =null;
			resultado = BCrypt.verifyer().verify(administradorDTO.getPassword().toCharArray(), administrador.getPassword());
			if(resultado.verified) {
				return administradorConverter.fromEntity(administrador);
			}else {
				throw new BondisUyException("Constraseña incorrecta.", BondisUyException.DATOS_INCORRECTOS);
			}
		}
	}

}
