package bondisuy.business;

import java.util.List;

import javax.ejb.Local;

import bondisuy.dto.HorarioCrearDTO;
import bondisuy.dto.HorarioDTO;
import bondisuy.exception.BondisUyException;

@Local
public interface IHorarioService {

	public List<HorarioDTO> listar() throws BondisUyException;
	public HorarioDTO listarPorId(Long id) throws BondisUyException;
	public HorarioDTO crear(HorarioCrearDTO horarioDTO) throws BondisUyException;
	public HorarioDTO editar(Long id, HorarioCrearDTO horarioDTO) throws BondisUyException;
	public void eliminar(Long id) throws BondisUyException;
		
}
