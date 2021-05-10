package bondisuy.dao;

import java.util.List;

import javax.ejb.Local;

import bondisuy.entity.Parada;

@Local
public interface IParadaDAO {

	public List<Parada> listar();
	public Parada listarPorId(Long id);
	public Parada crear(Parada parada);
	public Parada editar(Parada parada);
	public void eliminar(Parada parada);
	
}
