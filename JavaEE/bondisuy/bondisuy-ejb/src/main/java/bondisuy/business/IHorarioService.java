package bondisuy.business;

import java.util.List;

import javax.ejb.Local;

import bondisuy.dto.HorarioCrearDTO;
import bondisuy.dto.HorarioDTO;
import bondisuy.exception.BondisUyException;

@Local
public interface IHorarioService {

	public List<HorarioDTO> listar() throws BondisUyException;
	public HorarioDTO listarPorIds(HorarioCrearDTO horarioDTO) throws BondisUyException;
	public List<HorarioDTO> listarPorParadaYRecorrido(Long recorridoId, Long paradaId) throws BondisUyException;
	
}
