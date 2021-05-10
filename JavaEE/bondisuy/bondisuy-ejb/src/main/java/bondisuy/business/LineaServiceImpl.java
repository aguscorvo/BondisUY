package bondisuy.business;

import java.util.List;

import javax.ejb.EJB;
import javax.ejb.Stateless;

import bondisuy.converter.LineaConverter;
import bondisuy.converter.CompaniaConverter;
import bondisuy.dao.ICompaniaDAO;
import bondisuy.dao.ILineaDAO;
import bondisuy.dto.LineaCrearDTO;
import bondisuy.dto.LineaDTO;
import bondisuy.entity.Compania;
import bondisuy.entity.Linea;
import bondisuy.exception.BondisUyException;

@Stateless
public class LineaServiceImpl implements ILineaService {

	@EJB
	private ILineaDAO lineaDAO;
	
	@EJB
	private ICompaniaDAO companiaDAO;
	
	@EJB
	private LineaConverter lineaConverter;
	
	@EJB
	private CompaniaConverter companiaConverter;
	
	@Override
	public List<LineaDTO> listar() throws BondisUyException{
		try {
			return lineaConverter.fromEntity(lineaDAO.listar());
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
	
	@Override
	public LineaDTO listarPorId(Long id) throws BondisUyException{
		try {
			Linea linea = lineaDAO.listarPorId(id);
			if(linea==null) throw new BondisUyException("La linea indicada no existe.", BondisUyException.NO_EXISTE_REGISTRO);
			return lineaConverter.fromEntity(linea);
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
	
	@Override
	public LineaDTO crear(LineaCrearDTO lineaDTO) throws BondisUyException{
		try {
			Compania compania = companiaDAO.listarPorId(lineaDTO.getCompania());
			if(compania==null) throw new BondisUyException("La compania indicada no existe.", BondisUyException.NO_EXISTE_REGISTRO); 
			Linea linea = lineaConverter.fromCrearDTO(lineaDTO);
			linea.setCompania(compania);
			return lineaConverter.fromEntity(lineaDAO.crear(linea));
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
	
	@Override
	public LineaDTO editar(Long id, LineaCrearDTO lineaDTO) throws BondisUyException{
		try {
			Linea linea = lineaDAO.listarPorId(id);
			if(linea == null) throw new BondisUyException("La linea indicada no existe.", BondisUyException.NO_EXISTE_REGISTRO);
			Compania compania = companiaDAO.listarPorId(lineaDTO.getCompania());
			if(compania==null) throw new BondisUyException("La compania indicada no existe.", BondisUyException.NO_EXISTE_REGISTRO);
			linea.setNombre(lineaDTO.getNombre());
			linea.setOrigen(lineaDTO.getOrigen());
			linea.setDestino(lineaDTO.getDestino());
			linea.setCompania(compania);
			return lineaConverter.fromEntity(lineaDAO.editar(linea));
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
	
	@Override
	public void eliminar(Long id) throws BondisUyException{
		try {
			Linea linea = lineaDAO.listarPorId(id);
			if(linea == null) throw new BondisUyException("La linea indicada no existe.", BondisUyException.NO_EXISTE_REGISTRO);
			lineaDAO.eliminar(linea);
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
    

}
