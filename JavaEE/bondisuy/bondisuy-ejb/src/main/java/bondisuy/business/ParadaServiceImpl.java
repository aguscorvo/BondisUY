package bondisuy.business;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
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
import bondisuy.dto.ParadaGeomDTO;
import bondisuy.dto.ProximaLineaDTO;
import bondisuy.dto.RecorridoDTO;
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
			DateTimeFormatter formato = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
			Parada parada = paradaDAO.listarPorId(id);
			if(parada ==null) throw new BondisUyException("La parada indicada no existe.", BondisUyException.NO_EXISTE_REGISTRO);
			parada.setCodVia1(paradaDTO.getCodVia1());
			parada.setCodVia2(paradaDTO.getCodVia2());
			parada.setFecha(LocalDateTime.parse(paradaDTO.getFecha(), formato));
			parada.setDescripcion(paradaDTO.getDescripcion());
			parada.setHabilitada(paradaDTO.getHabilitada());
			if(paradaDTO.getGeometria() != null) {
				return paradaConverter.fromEntity(paradaDAO.editarConGeometria(parada, paradaDTO.getGeometria()));
			} else {
				return paradaConverter.fromEntity(paradaDAO.editar(parada));
			}
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
	
	@Override
	public void editarGeom(ParadaGeomDTO paradaGeom) throws BondisUyException{
		try {
			Parada parada = paradaDAO.listarPorId(paradaGeom.getId());
			if(parada ==null) throw new BondisUyException("La parada indicada no existe.", BondisUyException.NO_EXISTE_REGISTRO);
			paradaDAO.editarGeom(paradaGeom.getId(), paradaGeom.getGeometria());
			actualizarFecha(parada);
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}		
	}	
	
	@Override
	public void eliminar(Long id) throws BondisUyException{
		try {
			Parada parada = paradaDAO.listarPorId(id);
			if(parada ==null) throw new BondisUyException("La parada indicada no existe.", BondisUyException.NO_EXISTE_REGISTRO);
			eliminarHorarios(parada);
			paradaDAO.eliminar(parada);
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}

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
			actualizarEstado(parada);
			actualizarFecha(parada);
			recorridoService.actualizarFecha(recorrido);
			return horarioConverter.fromEntity(horario);
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
	
	@Override
	public void eliminarHorariosParadaRecorrido(Long parada, Long recorrido) throws BondisUyException{
		try {
			Recorrido recorridoAux = recorridoDAO.listarPorId(recorrido);
			if(recorridoAux==null) throw new BondisUyException("El recorrido indicado no existe.", BondisUyException.NO_EXISTE_REGISTRO);
			Parada paradaAux = paradaDAO.listarPorId(parada);
			if(paradaAux==null) throw new BondisUyException("La parada indicada no existe.", BondisUyException.NO_EXISTE_REGISTRO);
			List<Horario> horarios = horarioDAO.listarPorParadaYRecorrido(recorrido, parada);
			paradaAux.getHorarios().removeAll(horarios);
			paradaDAO.editar(paradaAux);
			actualizarEstado(paradaAux);
			actualizarFecha(paradaAux);
			recorridoService.actualizarFecha(recorridoAux);
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
	
	@Override
	public HorarioDTO editarHorario(HorarioCrearDTO horarioDTO, String hora) throws BondisUyException{
		try{
			Horario horario = horarioDAO.listarPorIds(LocalTime.parse(horarioDTO.getHora()), horarioDTO.getRecorrido(), horarioDTO.getParada());
			if(horario==null) throw new BondisUyException("El horario indicado no existe.", BondisUyException.NO_EXISTE_REGISTRO);		
			Parada parada = paradaDAO.listarPorId(horarioDTO.getParada());
			//se elimina el horario viejo
			parada.getHorarios().remove(horario);
			paradaDAO.editar(parada);
			//se crea nuevo horario
			HorarioCrearDTO horarioNuevo = new HorarioCrearDTO(hora, horarioDTO.getRecorrido(), horarioDTO.getParada());
			return crearHorario(horarioNuevo);
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
	
	//desde backend
	@Override
	public ParadaDTO actualizarEstado(Parada parada) throws BondisUyException{
		try {
			Boolean estadoOriginal = parada.getHabilitada();
			List<RecorridoDTO> recorridosActivos = recorridoService.listarActivosPorParada(parada.getId());
			String geom = paradaDAO.getGeom(parada.getId());
			System.out.println("geom: " + geom);
			List<Long> recorridosCercanos = recorridoService.listarCercanosPorParada(parada.getId(), geom);
			if(recorridosActivos.isEmpty())
				parada.setHabilitada(false);
			else if(recorridosCercanos.isEmpty())
				parada.setHabilitada(false);
			else
				parada.setHabilitada(true);
			// si cambió el estado de la parada se actualiza la fecha
			if(estadoOriginal!=parada.getHabilitada())
				actualizarFecha(parada);
			paradaDAO.editar(parada);
			return paradaConverter.fromEntity(parada);			
		}catch (Exception e) {
			System.out.println(e.getLocalizedMessage());
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
	
	//desde backend
	@Override
	public void eliminarHorarios(Parada parada)  throws BondisUyException{
		try {
			parada.getHorarios().clear();
			paradaDAO.editar(parada);
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
	
	public void actualizarFecha(Parada parada) throws BondisUyException{
		try {
			LocalDateTime hoy = LocalDateTime.now();
			parada.setFecha(hoy);
			paradaDAO.editar(parada);
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
	
}
