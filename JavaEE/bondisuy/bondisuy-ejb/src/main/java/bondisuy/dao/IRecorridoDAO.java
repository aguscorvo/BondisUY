package bondisuy.dao;

import java.util.List;

import javax.ejb.Local;

import bondisuy.entity.Recorrido;

@Local
public interface IRecorridoDAO {

	public List<Recorrido> listar();
	public Recorrido listarPorId(Long id);
	public Recorrido crear(Recorrido recorrido, String geometria);
	public Recorrido editar(Recorrido recorrido);
	public void eliminar(Recorrido recorrido);
	public List<Long> listarParadas(Long idRecorrido);
	
}
