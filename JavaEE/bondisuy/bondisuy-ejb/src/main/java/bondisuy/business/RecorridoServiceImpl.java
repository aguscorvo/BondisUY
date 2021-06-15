package bondisuy.business;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.EJB;
import javax.ejb.Stateless;

import bondisuy.converter.RecorridoConverter;
import bondisuy.dao.IHorarioDAO;
import bondisuy.dao.ILineaDAO;
import bondisuy.dao.IRecorridoDAO;
import bondisuy.dto.RecorridoCrearDTO;
import bondisuy.dto.RecorridoDTO;
import bondisuy.entity.Horario;
import bondisuy.entity.Linea;
import bondisuy.entity.Recorrido;
import bondisuy.exception.BondisUyException;

@Stateless
public class RecorridoServiceImpl implements IRecorridoService {

	@EJB
	private IRecorridoDAO recorridoDAO;
	
	@EJB
	private ILineaDAO lineaDAO;
	
	@EJB
	private ILineaService lineaService;
	
	@EJB
	private IHorarioDAO horarioDAO;
	
	@EJB
	private IParadaService paradaService;
	
	@EJB
	private RecorridoConverter recorridoConverter;
	
	@Override
	public List<RecorridoDTO> listar() throws BondisUyException{
		try {
			return recorridoConverter.fromEntity(recorridoDAO.listar());
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
	
	@Override
	public RecorridoDTO listarPorId(Long id) throws BondisUyException{
		try {
			Recorrido recorrido = recorridoDAO.listarPorId(id);
			if(recorrido ==null) throw new BondisUyException("El recorrido indicado no existe.", BondisUyException.NO_EXISTE_REGISTRO);
			return recorridoConverter.fromEntity(recorrido);
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
	
	@Override
	public RecorridoDTO crear(RecorridoCrearDTO recorridoDTO) throws BondisUyException{
		try {
			Linea linea = lineaDAO.listarPorId(recorridoDTO.getLinea());
			if(linea ==null) throw new BondisUyException("La linea indicada no existe.", BondisUyException.NO_EXISTE_REGISTRO);
			Recorrido recorrido = recorridoConverter.fromCrearDTO(recorridoDTO);
			recorrido.setLinea(linea);
			RecorridoDTO recorridoCreado = recorridoConverter.fromEntity(recorridoDAO.crear(recorrido,recorridoDTO.getGeometria()));
			return recorridoCreado;
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
	
	@Override
	public RecorridoDTO editar(Long id, RecorridoCrearDTO recorridoDTO) throws BondisUyException{
		try {
			Recorrido recorrido = recorridoDAO.listarPorId(id);
			if(recorrido ==null) throw new BondisUyException("El recorrido indicado no existe.", BondisUyException.NO_EXISTE_REGISTRO);
			recorrido.setActivo(recorrido.getActivo());
			return recorridoConverter.fromEntity(recorridoDAO.editar(recorrido));
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
	
	@Override
	public void eliminar(Long id) throws BondisUyException{
		try {
			Recorrido recorrido = recorridoDAO.listarPorId(id);
			if(recorrido ==null) throw new BondisUyException("El recorrido indicado no existe.", BondisUyException.NO_EXISTE_REGISTRO);
			//obtengo las paradas asociadas a los horarios asociados al recorrido
			List<Long> paradas = recorridoDAO.listarParadas(id);
			//por cada parada ejecuto eliminarHorarios
			for (Long parada: paradas) {
				paradaService.eliminarHorarios(parada, id);
			}
			//eliminar recorrido
			recorridoDAO.eliminar(recorrido);
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
	
	// solo se llama desde backend
	@Override
	public void agregarHorario(Long recorrido, Long horario) throws BondisUyException{
		// se valida que el horario exista
		Horario horarioAux = horarioDAO.listarPorId(horario);
		if(horario ==null) throw new BondisUyException("El horario indicado no existe.", BondisUyException.NO_EXISTE_REGISTRO);
		// se valida que el horario no se encuentre asociado al recorrido
		Recorrido recorridoAux = recorridoDAO.listarPorId(recorrido);
		for(Horario h: recorridoAux.getHorarios()) {
			if(h.getId()==horario) throw new BondisUyException("El horario indicado ya se encuentra asociado al recorrido.", BondisUyException.EXISTE_REGISTRO);
		}
		// se asocia el horario al recorrido
		recorridoAux.getHorarios().add(horarioAux);
		recorridoDAO.editar(recorridoAux);		
	}
	
	// solo se llama desde backend
	@Override
	public void eliminarHorarios(Long recorrido, List<Long> horarios) throws BondisUyException{
		try {
			Recorrido recorridoAux = recorridoDAO.listarPorId(recorrido);
			List<Horario> horariosAEliminar = new ArrayList<Horario>();
			for(Long horarioAEliminar: horarios) {
				for(Horario horario: recorridoAux.getHorarios()) {
					if (horario.getId()==horarioAEliminar) {
						horariosAEliminar.add(horario);
						return;
					}
				}
			}
			recorridoAux.getHorarios().removeAll(horariosAEliminar);
			recorridoDAO.editar(recorridoAux);	
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}


    
}
