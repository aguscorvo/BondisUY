package bondisuy.dao;

import java.util.List;

import javax.ejb.Local;

import bondisuy.entity.Administrador;

@Local
public interface IAdministradorDAO {
	
	public List<Administrador> listar();
	public Administrador listarPorId(Long id);
	public Administrador listarPorUsername(String username);
	public Administrador crear(Administrador administrador);
	public Administrador editar(Administrador administrador);
	public void eliminar(Administrador administrador);

}
