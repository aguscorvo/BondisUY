package bondisuy.business;

import java.util.List;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import bondisuy.converter.CompaniaConverter;
import bondisuy.dao.ICompaniaDAO;
import bondisuy.dto.CompaniaCrearDTO;
import bondisuy.dto.CompaniaDTO;
import bondisuy.entity.Compania;
import bondisuy.exception.BondisUyException;

@Stateless
public class CompaniaServiceImpl implements ICompaniaService {

	@EJB
	private ICompaniaDAO companiaDAO;
	
	@EJB
	private CompaniaConverter companiaConverter;
	
	@Override
	public List<CompaniaDTO> listar() throws BondisUyException {
		try {
			return companiaConverter.fromEntity(companiaDAO.listar());
		} catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}		
	}

	@Override
	public CompaniaDTO listarPorId(Long id) throws BondisUyException {
		try {
			Compania compania = companiaDAO.listarPorId(id);
			if(compania == null) throw new BondisUyException("No existe el registro solicitado.", BondisUyException.NO_EXISTE_REGISTRO);
			return companiaConverter.fromEntity(compania);
		} catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}

	@Override
	public CompaniaDTO crear(CompaniaCrearDTO companiaDTO) throws BondisUyException {
		try {
			Compania compania = companiaConverter.fromCrearDTO(companiaDTO);
			if(compania == null) throw new BondisUyException("Los datos ingresados no son correctos.", BondisUyException.DATOS_INCORRECTOS);
			return companiaConverter.fromEntity(companiaDAO.crear(compania));
		} catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}

	@Override
	public CompaniaDTO editar(CompaniaCrearDTO compania) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void eliminar(Long id) {
		// TODO Auto-generated method stub
		
	}
	
	
}
