package bondisuy.business;

import java.util.List;

import javax.ejb.Local;

import bondisuy.dto.HorarioCrearDTO;
import bondisuy.dto.HorarioDTO;
import bondisuy.dto.ParadaCrearDTO;
import bondisuy.dto.ParadaDTO;
import bondisuy.dto.ProximaLineaDTO;
import bondisuy.entity.Parada;
import bondisuy.exception.BondisUyException;

@Local
public interface IParadaService {

	public List<ParadaDTO> listar() throws BondisUyException;
	public ParadaDTO listarPorId(Long id) throws BondisUyException;
	public ParadaDTO crear(ParadaCrearDTO paradaDTO) throws BondisUyException;
	public ParadaDTO editar(Long id, ParadaCrearDTO paradaDTO) throws BondisUyException;
//	public Long editarGeom(ParadaGeomDTO paradaGeom) throws BondisUyException;
	public void eliminar(Long id) throws BondisUyException;
	public List<ProximaLineaDTO> proximasLineas(Long idParada, String horario) throws BondisUyException;
	public Long eliminarHorariosParadaRecorrido(Long parada, Long recorrido) throws BondisUyException;
	public HorarioDTO crearHorario(HorarioCrearDTO horarioDTO) throws BondisUyException;
	public HorarioDTO editarHorario(HorarioCrearDTO horarioDTO, String hora) throws BondisUyException;
	public List<HorarioDTO> crearHorarios(List<HorarioCrearDTO> horariosDTO) throws BondisUyException;
	public List<Long> eliminarHorarios(List<HorarioCrearDTO> horariosDTO) throws BondisUyException;
	
	//desde backend
	public Boolean actualizarEstado(Parada parada) throws BondisUyException;
	public void eliminarHorariosParada(Parada parada) throws BondisUyException;

	
}
