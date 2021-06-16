package bondisuy.business;

import java.time.LocalTime;
import java.util.List;

import javax.ejb.EJB;
import javax.ejb.Stateless;

import bondisuy.converter.HorarioConverter;
import bondisuy.converter.ParadaConverter;
import bondisuy.dao.IHorarioDAO;
import bondisuy.dao.IParadaDAO;
import bondisuy.dao.IRecorridoDAO;
import bondisuy.dto.HorarioCrearDTO;
import bondisuy.dto.HorarioDTO;
import bondisuy.dto.ParadaCrearDTO;
import bondisuy.dto.ParadaDTO;
import bondisuy.dto.ProximaLineaDTO;
import bondisuy.entity.Horario;
import bondisuy.entity.Parada;
import bondisuy.entity.Recorrido;
import bondisuy.exception.BondisUyException;

@Stateless
public class ParadaServiceImpl implements IParadaService {

   @EJB
   private IParadaDAO paradaDAO;
   
   @EJB
   private IHorarioDAO horarioDAO;
   
   @EJB
   private IHorarioService horarioService;
   
   @EJB
   private IRecorridoDAO recorridoDAO;
   
   @EJB
   private HorarioConverter horarioConverter;
   
   @EJB
   private IRecorridoService recorridoService;
   
   @EJB
   private ParadaConverter paradaConverter;
   
   @Override
	public List<ParadaDTO> listar() throws BondisUyException{
		try {
			return paradaConverter.fromEntity(paradaDAO.listar());
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
	
	@Override
	public ParadaDTO listarPorId(Long id) throws BondisUyException{
		try {
			Parada parada = paradaDAO.listarPorId(id);
			if(parada ==null) throw new BondisUyException("La parada indicada no existe.", BondisUyException.NO_EXISTE_REGISTRO);
			return paradaConverter.fromEntity(parada);
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
	
	@Override
	public ParadaDTO crear(ParadaCrearDTO paradaDTO) throws BondisUyException{
		try {
			Parada parada = paradaConverter.fromCrearDTO(paradaDTO);
			return paradaConverter.fromEntity(paradaDAO.crear(parada, paradaDTO.getGeometria()));
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
	
	@Override
	public ParadaDTO editar(Long id, ParadaCrearDTO paradaDTO) throws BondisUyException{
		try {
			Parada parada = paradaDAO.listarPorId(id);
			if(parada ==null) throw new BondisUyException("La parada indicada no existe.", BondisUyException.NO_EXISTE_REGISTRO);
			parada.setHabilitada(paradaDTO.getHabilitada());
			return paradaConverter.fromEntity(paradaDAO.editar(parada));
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
	
	
//	@Override
//	public void eliminar(Long id) throws BondisUyException{
//		try {
//			Parada parada = paradaDAO.listarPorId(id);
//			if(parada ==null) throw new BondisUyException("La parada indicada no existe.", BondisUyException.NO_EXISTE_REGISTRO);
//			//obtengo los recorridos asociados a los horarios asociados a la parada
//			List<Long> recorridos = paradaDAO.listarRecorridos(id);
//			//por cada recorrido ejecuto eliminarHorarios
//			for(Long recorrido: recorridos) {
////				eliminarHorarios(id, recorrido);
//			}
//			//eliminar parada
//			paradaDAO.eliminar(parada);
//		}catch (Exception e) {
//			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
//		}
//	}

	@Override
	public List<ProximaLineaDTO> proximasLineas(Long idParada, String horario) throws BondisUyException{
		try {
			//se valida que parada exista
			Parada parada = paradaDAO.listarPorId(idParada);
			if(parada ==null) throw new BondisUyException("La parada indicada no existe.", BondisUyException.NO_EXISTE_REGISTRO);
			return paradaDAO.proximasLineas(idParada, horario);		
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}	
	
	@Override
	public HorarioDTO crearHorario(HorarioCrearDTO horarioDTO) throws BondisUyException{
		try {
			Recorrido recorrido = recorridoDAO.listarPorId(horarioDTO.getRecorrido());
			if(recorrido==null) throw new BondisUyException("El recorrido indicado no existe.", BondisUyException.NO_EXISTE_REGISTRO);
			Parada parada = paradaDAO.listarPorId(horarioDTO.getParada());
			if(parada==null) throw new BondisUyException("La parada indicada no existe.", BondisUyException.NO_EXISTE_REGISTRO);
			Horario horarioAux = horarioDAO.listarPorIds(LocalTime.parse(horarioDTO.getHora()), horarioDTO.getRecorrido(), 
					horarioDTO.getParada());
			if(horarioAux!=null) throw new BondisUyException("El horario indicado ya existe.", BondisUyException.EXISTE_REGISTRO);
			Horario horario = horarioConverter.fromCrearDTO(horarioDTO);
			horario.setRecorrido(recorrido);
			horario.setParada(parada);			
			parada.getHorarios().add(horario);
			paradaDAO.editar(parada);			
			return horarioConverter.fromEntity(horario);
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
	
	@Override
	public void eliminarHorarios(Long parada, Long recorrido) throws BondisUyException{
		try {
			Recorrido recorridoAux = recorridoDAO.listarPorId(recorrido);
			if(recorridoAux==null) throw new BondisUyException("El recorrido indicado no existe.", BondisUyException.NO_EXISTE_REGISTRO);
			Parada paradaAux = paradaDAO.listarPorId(parada);
			if(paradaAux==null) throw new BondisUyException("La parada indicada no existe.", BondisUyException.NO_EXISTE_REGISTRO);
			List<Horario> horarios = horarioDAO.listarPorRecorridoYParada(recorrido, parada);
			paradaAux.getHorarios().removeAll(horarios);
			paradaDAO.editar(paradaAux);		
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
	
}
