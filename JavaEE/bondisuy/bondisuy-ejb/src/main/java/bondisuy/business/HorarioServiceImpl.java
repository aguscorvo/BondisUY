package bondisuy.business;

import java.time.LocalTime;
import java.util.List;

import javax.ejb.EJB;
import javax.ejb.Stateless;

import bondisuy.converter.HorarioConverter;
import bondisuy.dao.IHorarioDAO;
import bondisuy.dao.IParadaDAO;
import bondisuy.dao.IRecorridoDAO;
import bondisuy.dto.HorarioCrearDTO;
import bondisuy.dto.HorarioDTO;
import bondisuy.entity.Parada;
import bondisuy.entity.Recorrido;
import bondisuy.exception.BondisUyException;

@Stateless
public class HorarioServiceImpl implements IHorarioService {

	@EJB
	private IHorarioDAO horarioDAO;
	
	@EJB
	private IRecorridoDAO recorridoDAO;
	
	@EJB
	private IParadaDAO paradaDAO;
	
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
	public HorarioDTO listarPorIds(HorarioCrearDTO horarioDTO) throws BondisUyException{
		try {
			return horarioConverter.fromEntity(horarioDAO.listarPorIds(LocalTime.parse(horarioDTO.getHora()), 
					horarioDTO.getRecorrido(), horarioDTO.getParada()));
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
	
	@Override
	public List<HorarioDTO> listarPorParadaYRecorrido(Long recorridoId, Long paradaId) throws BondisUyException{
		try {
			Parada parada = paradaDAO.listarPorId(paradaId);
			if(parada==null) throw new BondisUyException("La parada indicada no existe.", BondisUyException.NO_EXISTE_REGISTRO);
			Recorrido recorrido = recorridoDAO.listarPorId(recorridoId);
			if(recorrido==null) throw new BondisUyException("El recorrido indicado no existe.", BondisUyException.NO_EXISTE_REGISTRO);
			return horarioConverter.fromEntity(horarioDAO.listarPorParadaYRecorrido(recorridoId, paradaId));
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
	

}
