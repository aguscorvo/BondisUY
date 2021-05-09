package bondisuy.business;

import java.util.List;
import javax.ejb.Local;
import bondisuy.dto.CompaniaCrearDTO;
import bondisuy.dto.CompaniaDTO;
import bondisuy.exception.BondisUyException;

@Local
public interface ICompaniaService {

	public List<CompaniaDTO> listar() throws BondisUyException;
	public CompaniaDTO listarPorId(Long id) throws BondisUyException;
	public CompaniaDTO crear(CompaniaCrearDTO companiaDTO) throws BondisUyException;
	public CompaniaDTO editar(CompaniaCrearDTO companiaDTO) throws BondisUyException;
	public void eliminar(Long id) throws BondisUyException;
	
}
