package bondisuy.business;

import java.util.List;

import javax.ejb.Local;

import bondisuy.dto.LineaCrearDTO;
import bondisuy.dto.LineaDTO;
import bondisuy.exception.BondisUyException;

@Local
public interface ILineaService {
	
	public List<LineaDTO> listar() throws BondisUyException;
	public LineaDTO listarPorId(Long id) throws BondisUyException;
	public LineaDTO crear(LineaCrearDTO lineaDTO) throws BondisUyException;
	public LineaDTO editar(Long id, LineaCrearDTO lineaDTO) throws BondisUyException;
	public void eliminar(Long id) throws BondisUyException;
	
}
