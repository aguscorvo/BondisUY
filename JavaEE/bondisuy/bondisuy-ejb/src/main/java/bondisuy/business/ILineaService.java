package bondisuy.business;

import java.util.List;

import javax.ejb.Local;

import bondisuy.dto.LineaCrearDTO;
import bondisuy.dto.LineaDTO;
import bondisuy.dto.LineaMinDTO;
import bondisuy.exception.BondisUyException;

@Local
public interface ILineaService {
	
	public List<LineaMinDTO> listar() throws BondisUyException;
	public LineaDTO listarPorId(Long id) throws BondisUyException;
	public List<LineaMinDTO> listarPorCompania(Long idCompania) throws BondisUyException;
	public LineaDTO crear(LineaCrearDTO lineaDTO) throws BondisUyException;
	public LineaDTO editar(Long id, LineaCrearDTO lineaDTO) throws BondisUyException;
	public void eliminar(Long id) throws BondisUyException;
	
	// solo se llama desde backend
	public void agregarRecorrido(Long linea, Long recorrido) throws BondisUyException;

}
