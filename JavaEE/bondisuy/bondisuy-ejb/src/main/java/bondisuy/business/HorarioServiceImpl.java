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
import bondisuy.entity.Horario;
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
	private IRecorridoService recorridoService;
	
	@EJB
	private IParadaService paradaService;
	
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
			Recorrido recorrido = recorridoDAO.listarPorId(horarioDTO.getRecorrido());
			if(recorrido==null) throw new BondisUyException("El recorrido indicado no existe.", BondisUyException.NO_EXISTE_REGISTRO);
			Parada parada = paradaDAO.listarPorId(horarioDTO.getParada());
			if(parada==null) throw new BondisUyException("La parada indicada no existe.", BondisUyException.NO_EXISTE_REGISTRO);
			Horario horario = horarioConverter.fromCrearDTO(horarioDTO);
			horario.setRecorrido(recorrido);
			horario.setParada(parada);
			HorarioDTO horarioCreado = horarioConverter.fromEntity(horarioDAO.crear(horario));
			// Se agrega el horario al recorrido
			recorridoService.agregarHorario(recorrido.getId(), horarioCreado.getId());
			// Se agrega el horario a la parada
			paradaService.agregarHorario(parada.getId(), horarioCreado.getId());
			return horarioCreado;
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
	
	//desde backend
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
	
	@Override
	public List<Long> listarPorParadaYRecorrido(Long paradaId, Long recorridoId) throws BondisUyException{
		try {
			Parada parada = paradaDAO.listarPorId(paradaId);
			if(parada==null) throw new BondisUyException("La parada indicada no existe.", BondisUyException.NO_EXISTE_REGISTRO);
			Recorrido recorrido = recorridoDAO.listarPorId(recorridoId);
			if(recorrido==null) throw new BondisUyException("El recorrido indicado no existe.", BondisUyException.NO_EXISTE_REGISTRO);
			return horarioDAO.listarPorParadaYRecorrido(paradaId, recorridoId);
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}   

}
