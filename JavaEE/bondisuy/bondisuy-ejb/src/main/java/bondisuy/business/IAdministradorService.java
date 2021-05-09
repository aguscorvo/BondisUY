package bondisuy.business;

import java.util.List;

import javax.ejb.Local;

import bondisuy.dto.AdministradorCrearDTO;
import bondisuy.dto.AdministradorDTO;
import bondisuy.dto.AdministradorLoginDTO;
import bondisuy.exception.BondisUyException;

@Local
public interface IAdministradorService {

	public List<AdministradorDTO> listar() throws BondisUyException;
	public AdministradorDTO listarPorId(Long id) throws BondisUyException;
	public AdministradorDTO listarPorUsername(String username) throws BondisUyException;
	public AdministradorDTO crear(AdministradorCrearDTO administradorDTO) throws BondisUyException;
	public AdministradorDTO editar(Long id, AdministradorCrearDTO administradorDTO) throws BondisUyException;
	public void eliminar(Long id) throws BondisUyException;
	public AdministradorDTO login(AdministradorLoginDTO administradorDTO) throws BondisUyException;
	
}
