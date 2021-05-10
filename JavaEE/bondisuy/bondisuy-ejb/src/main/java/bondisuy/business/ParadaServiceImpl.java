package bondisuy.business;

import java.util.List;

import javax.ejb.EJB;
import javax.ejb.Stateless;

import bondisuy.converter.ParadaConverter;
import bondisuy.dao.IParadaDAO;
import bondisuy.dto.ParadaCrearDTO;
import bondisuy.dto.ParadaDTO;
import bondisuy.entity.Parada;
import bondisuy.exception.BondisUyException;

@Stateless
public class ParadaServiceImpl implements IParadaService {

   @EJB
   private IParadaDAO paradaDAO;
   
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
			return paradaConverter.fromEntity(paradaDAO.crear(parada));
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
	
	@Override
	public void eliminar(Long id) throws BondisUyException{
		try {
			Parada parada = paradaDAO.listarPorId(id);
			if(parada ==null) throw new BondisUyException("La parada indicada no existe.", BondisUyException.NO_EXISTE_REGISTRO);
			paradaDAO.eliminar(parada);
		}catch (Exception e) {
			throw new BondisUyException(e.getLocalizedMessage(), BondisUyException.ERROR_GENERAL);
		}
	}
   

}
