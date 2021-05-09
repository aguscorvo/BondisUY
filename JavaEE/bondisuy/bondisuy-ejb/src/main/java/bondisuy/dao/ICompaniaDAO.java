package bondisuy.dao;

import java.util.List;

import javax.ejb.Local;

import bondisuy.entity.Compania;

@Local
public interface ICompaniaDAO {
	
	public List<Compania> listar();
	public Compania listarPorId(Long id);
	public Compania crear(Compania compania);
	public Compania editar(Compania compania);
	public void eliminar(Compania compania);

}
