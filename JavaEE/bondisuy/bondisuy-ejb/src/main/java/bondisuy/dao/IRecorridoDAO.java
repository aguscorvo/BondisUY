package bondisuy.dao;

import java.util.List;

import javax.ejb.Local;

import bondisuy.entity.Recorrido;

@Local
public interface IRecorridoDAO {

	public List<Recorrido> listar();
	public Recorrido listarPorId(Long id);
	public Recorrido crear(Recorrido recorrido);
	public Recorrido editar(Recorrido recorrido);
	public void eliminar(Recorrido recorrido);
	
}
