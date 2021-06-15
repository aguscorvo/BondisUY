package bondisuy.dao;

import java.util.List;

import javax.ejb.Local;

import bondisuy.dto.ProximaLineaDTO;
import bondisuy.entity.Horario;
import bondisuy.entity.Parada;

@Local
public interface IParadaDAO {

	public List<Parada> listar();
	public Parada listarPorId(Long id);
	public Parada crear(Parada parada, String geometria);
	public Parada editar(Parada parada);
	public void eliminar(Parada parada);
	public List<ProximaLineaDTO> proximasLineas(Long idParada, String horario);
	
}
