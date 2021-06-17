package bondisuy.business;

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
	private ILineaService lineaService;
	
	@EJB
	private IHorarioDAO horarioDAO;
	
	@EJB
	private IParadaDAO paradaDAO;
	
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
	
//	@Override
//	public void eliminar(Long id) throws BondisUyException{
//		try {
//			Recorrido recorrido = recorridoDAO.listarPorId(id);
//			if(recorrido ==null) throw new BondisUyException("El recorrido indicado no existe.", BondisUyException.NO_EXISTE_REGISTRO);
//			//obtengo las paradas asociadas a los horarios asociados al recorrido
//			List<Long> paradas = recorridoDAO.listarParadas(id);
//			//por cada parada ejecuto eliminarHorarios
//			for (Long parada: paradas) {
////				paradaService.eliminarHorarios(parada, id);
//			}
//			//chequear estado de parada
//			//eliminar recorrido
//			recorridoDAO.eliminar(recorrido);
//		}catch (Exception e) {
//			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
//		}
//	}
	
	public List<RecorridoDTO> listarActivosPorParada(Long idParada) throws BondisUyException{
		try {
			Parada paradaAux = paradaDAO.listarPorId(idParada);
			if(paradaAux==null) throw new BondisUyException("La parada indicada no existe.", BondisUyException.NO_EXISTE_REGISTRO);
			return recorridoConverter.fromEntity(recorridoDAO.listarActivosPorParada(idParada));
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}



    
}
