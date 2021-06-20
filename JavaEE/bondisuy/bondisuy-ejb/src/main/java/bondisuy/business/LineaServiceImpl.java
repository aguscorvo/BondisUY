package bondisuy.business;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.EJB;
import javax.ejb.Stateless;

import bondisuy.converter.LineaConverter;
import bondisuy.dao.ICompaniaDAO;
import bondisuy.dao.ILineaDAO;
import bondisuy.dao.IRecorridoDAO;
import bondisuy.dto.LineaCrearDTO;
import bondisuy.dto.LineaDTO;
import bondisuy.dto.LineaMinDTO;
import bondisuy.entity.Compania;
import bondisuy.entity.Linea;
import bondisuy.entity.Recorrido;
import bondisuy.exception.BondisUyException;

@Stateless
public class LineaServiceImpl implements ILineaService {

	@EJB
	private ILineaDAO lineaDAO;
	
	@EJB
	private ICompaniaDAO companiaDAO;
	
	@EJB
	private IRecorridoService recorridoService;
	
	@EJB
	private IRecorridoDAO recorridoDAO;
	
	@EJB
	private LineaConverter lineaConverter;

	
	@Override
	public List<LineaMinDTO> listar() throws BondisUyException{
		try {
			return lineaConverter.fromEntityToMin(lineaDAO.listar());
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
	public List<LineaMinDTO> listarPorCompania(Long idCompania) throws BondisUyException {
		try {
			List<Linea> lineas = lineaDAO.listarPorCompania(idCompania);
			return lineaConverter.fromEntityToMin(lineas);
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
			List<Recorrido> recorridos = new ArrayList<Recorrido>();
			recorridos.addAll(linea.getRecorridos());
			for(Recorrido r : recorridos) {
				recorridoService.eliminar(r.getId());
			}
			lineaDAO.eliminar(linea);
		}catch (Exception e) {
			e.printStackTrace();
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
	
	// solo se llama desde backend
	@Override
	public void agregarRecorrido(Long linea, Long recorrido) throws BondisUyException{
		// se valida que exista el recorrido. No se valida la linea ya que se hizo en crear() de RecorridoService
		Recorrido recorridoAux= recorridoDAO.listarPorId(recorrido);
		if(recorridoAux == null) throw new BondisUyException("El recorrido indicado no existe.", BondisUyException.NO_EXISTE_REGISTRO);
		// se valida que la linea no tenga el recorrido asociado
		Linea lineaAux = lineaDAO.listarPorId(linea);
		for(Recorrido r: lineaAux.getRecorridos()) {
			if(r.getId()==recorrido) throw new BondisUyException("La línea y el recorrido indicados ya se encuentran asociados.", BondisUyException.EXISTE_REGISTRO);
		}
		// se agrega el recorrido a la linea
		lineaAux.getRecorridos().add(recorridoAux);
		lineaDAO.editar(lineaAux);
	}   

}
