package bondisuy.business;

import java.util.List;

import javax.ejb.Local;

import bondisuy.dto.RecorridoCrearDTO;
import bondisuy.dto.RecorridoDTO;
import bondisuy.dto.RecorridoGeomDTO;
import bondisuy.exception.BondisUyException;

@Local
public interface IRecorridoService {

	public List<RecorridoDTO> listar() throws BondisUyException;
	public RecorridoDTO listarPorId(Long id) throws BondisUyException;
	public RecorridoDTO crear(RecorridoCrearDTO recorridoDTO) throws BondisUyException;
	public RecorridoDTO editar(Long id, RecorridoCrearDTO recorridoDTO) throws BondisUyException;
	public void editarGeom(RecorridoGeomDTO recorridoGeom) throws BondisUyException;
	public void eliminar(Long id) throws BondisUyException;
	public List<RecorridoDTO> listarActivosPorParada(Long idParada) throws BondisUyException;
	
	//desde backend
	public List<RecorridoDTO> listarCercanosPorParada(String geometria) throws BondisUyException;	

}
