package bondisuy.dao;

import java.util.List;

import javax.ejb.Local;

import bondisuy.entity.Linea;

@Local
public interface ILineaDAO {
	
	public List<Linea> listar();
	public Linea listarPorId(Long id);
	public List<Linea> listarPorCompania(Long idCompania);
	public Linea crear(Linea linea);
	public Linea editar(Linea linea);
	public void eliminar(Linea linea);	

}
