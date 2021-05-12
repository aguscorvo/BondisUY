package bondisuy.business;

import java.util.List;

import javax.ejb.Local;

import bondisuy.dto.ParadaCrearDTO;
import bondisuy.dto.ParadaDTO;
import bondisuy.exception.BondisUyException;

@Local
public interface IParadaService {

	public List<ParadaDTO> listar() throws BondisUyException;
	public ParadaDTO listarPorId(Long id) throws BondisUyException;
	public ParadaDTO crear(ParadaCrearDTO paradaDTO) throws BondisUyException;
	public ParadaDTO editar(Long id, ParadaCrearDTO paradaDTO) throws BondisUyException;
	public void eliminar(Long id) throws BondisUyException;
	
	// solo se llama desde backend
	public void agregarHorario(Long parada, Long horario) throws BondisUyException;
}