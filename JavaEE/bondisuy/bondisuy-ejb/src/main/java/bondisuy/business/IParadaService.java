package bondisuy.business;

import java.util.List;

import javax.ejb.Local;

import bondisuy.dto.HorarioCrearDTO;
import bondisuy.dto.HorarioDTO;
import bondisuy.dto.ParadaCrearDTO;
import bondisuy.dto.ParadaDTO;
import bondisuy.dto.ProximaLineaDTO;
import bondisuy.exception.BondisUyException;

@Local
public interface IParadaService {

	public List<ParadaDTO> listar() throws BondisUyException;
	public ParadaDTO listarPorId(Long id) throws BondisUyException;
	public ParadaDTO crear(ParadaCrearDTO paradaDTO) throws BondisUyException;
	public ParadaDTO editar(Long id, ParadaCrearDTO paradaDTO) throws BondisUyException;
//	public void eliminar(Long id) throws BondisUyException;
	public List<ProximaLineaDTO> proximasLineas(Long idParada, String horario) throws BondisUyException;
	public void eliminarHorarios(Long parada, Long recorrido) throws BondisUyException;
	public HorarioDTO crearHorario(HorarioCrearDTO horarioDTO) throws BondisUyException;
	
}
