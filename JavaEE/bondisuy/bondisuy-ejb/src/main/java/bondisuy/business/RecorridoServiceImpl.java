package bondisuy.business;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.ejb.EJB;
import javax.ejb.Stateless;

import bondisuy.converter.RecorridoConverter;
import bondisuy.dao.IHorarioDAO;
import bondisuy.dao.ILineaDAO;
import bondisuy.dao.IParadaDAO;
import bondisuy.dao.IRecorridoDAO;
import bondisuy.dto.RecorridoCrearDTO;
import bondisuy.dto.RecorridoDTO;
import bondisuy.dto.RecorridoGeomDTO;
import bondisuy.entity.Linea;
import bondisuy.entity.Parada;
import bondisuy.entity.Recorrido;
import bondisuy.exception.BondisUyException;

@Stateless
public class RecorridoServiceImpl implements IRecorridoService {

	@EJB
	private IRecorridoDAO recorridoDAO;
	
	@EJB
	private ILineaDAO lineaDAO;
	
	@EJB
	private IHorarioDAO horarioDAO;
	
	@EJB
	private IParadaDAO paradaDAO;
	
	@EJB
	private RecorridoConverter recorridoConverter;
	
	@EJB
	private IParadaService paradaService;
	
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
	
	// devuelve lista de id de paradas que quedan hu??rfanas
	@Override
	public List<Long> eliminar(Long id) throws BondisUyException{
		try {
			Recorrido recorrido = recorridoDAO.listarPorId(id);
			if(recorrido == null) throw new BondisUyException("El recorrido indicado no existe.", BondisUyException.NO_EXISTE_REGISTRO);
			//obtengo las paradas asociadas a los horarios asociados al recorrido
			List<Parada> paradas = paradaDAO.listarPorRecorrido(id);
			//por cada parada ejecuto eliminarHorarios
			List<Long> paradasHuerfanas = new ArrayList<Long>();
			for (Parada parada: paradas) {
				paradaService.eliminarHorariosParadaRecorrido(parada.getId(), id);
				//chequear estado de parada
				if(paradaService.actualizarEstado(parada))
					paradasHuerfanas.add(parada.getId());	
			}			
			//eliminar recorrido
			Linea linea = recorrido.getLinea();
			linea.getRecorridos().remove(recorrido);
			lineaDAO.editar(linea);
			return paradasHuerfanas;
		}catch (Exception e) {
			System.out.println(e.getLocalizedMessage());
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
	
	@Override
	public List<RecorridoDTO> listarActivosPorParada(Long idParada) throws BondisUyException{
		try {
			Parada paradaAux = paradaDAO.listarPorId(idParada);
			if(paradaAux==null) throw new BondisUyException("La parada indicada no existe.", BondisUyException.NO_EXISTE_REGISTRO);
			return recorridoConverter.fromEntity(recorridoDAO.listarActivosPorParada(idParada));
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}

	// devuelve lista de id de paradas que quedan hu??rfanas
	@Override
	public List<Long> editarGeom(RecorridoGeomDTO recorridoGeom) throws BondisUyException {
		try {
			Recorrido recorrido = recorridoDAO.listarPorId(recorridoGeom.getId());
			if(recorrido ==null) throw new BondisUyException("El recorrido indicado no existe.", BondisUyException.NO_EXISTE_REGISTRO);
			recorridoDAO.editarGeom(recorridoGeom.getId(), recorridoGeom.getGeometria());
			List<Long> paradasHuerfanas = new ArrayList<Long>();
			for(Parada p: paradaDAO.listarPorRecorrido(recorridoGeom.getId())) {
				if(paradaService.actualizarEstado(p))
					paradasHuerfanas.add(p.getId());				
			}
			actualizarFecha(recorrido);
			return paradasHuerfanas;
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
	
	//desde backend
	@Override
	public List<Long> listarCercanosPorParada(Long idParada, String geometria) throws BondisUyException{
		try {
			return recorridoDAO.listarCercanosPorParada(idParada, geometria);
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}	
	
	//desde backend
	@Override
	public void actualizarFecha(Recorrido recorrido) throws BondisUyException{
		try {
			LocalDateTime hoy = LocalDateTime.now();
			recorrido.setFecha(hoy);
			recorridoDAO.editar(recorrido);
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
}
