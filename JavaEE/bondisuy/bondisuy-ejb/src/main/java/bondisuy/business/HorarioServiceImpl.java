package bondisuy.business;

import java.time.LocalTime;
import java.util.List;

import javax.ejb.EJB;
import javax.ejb.Stateless;

import bondisuy.converter.HorarioConverter;
import bondisuy.dao.IHorarioDAO;
import bondisuy.dto.HorarioCrearDTO;
import bondisuy.dto.HorarioDTO;
import bondisuy.entity.Horario;
import bondisuy.exception.BondisUyException;

@Stateless
public class HorarioServiceImpl implements IHorarioService {

	@EJB
	private IHorarioDAO horarioDAO;
	
	@EJB
	private HorarioConverter horarioConverter;
	
	@Override
	public List<HorarioDTO> listar() throws BondisUyException{
		try {
			return horarioConverter.fromEntity(horarioDAO.listar());
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
	
	@Override
	public HorarioDTO listarPorId(Long id) throws BondisUyException{
		try {
			Horario horario = horarioDAO.listarPorId(id);
			if(horario==null) throw new BondisUyException("El horario indicado no existe.", BondisUyException.NO_EXISTE_REGISTRO);
			return horarioConverter.fromEntity(horario);
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
	
	@Override
	public HorarioDTO crear(HorarioCrearDTO horarioDTO) throws BondisUyException{
		try {
			Horario horario = horarioConverter.fromCrearDTO(horarioDTO);
			return horarioConverter.fromEntity(horarioDAO.crear(horario));
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
	
	@Override
	public HorarioDTO editar(Long id, HorarioCrearDTO horarioDTO) throws BondisUyException{
		try {
			Horario horario = horarioDAO.listarPorId(id);
			if(horario==null) throw new BondisUyException("El horario indicado no existe.", BondisUyException.NO_EXISTE_REGISTRO);
			horario.setHora(LocalTime.parse(horarioDTO.getHora()));
			return horarioConverter.fromEntity(horarioDAO.editar(horario));
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
	
	@Override
	public void eliminar(Long id) throws BondisUyException{
		try {
			Horario horario = horarioDAO.listarPorId(id);
			if(horario==null) throw new BondisUyException("El horario indicado no existe.", BondisUyException.NO_EXISTE_REGISTRO);
			horarioDAO.eliminar(horario);
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
   

}
