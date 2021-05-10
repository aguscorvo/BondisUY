package bondisuy.dao;

import java.util.List;

import javax.ejb.Local;

import bondisuy.entity.Horario;

@Local
public interface IHorarioDAO {
	
	public List<Horario> listar();
	public Horario listarPorId(Long id);
	public Horario crear(Horario horario);
	public Horario editar(Horario horario);
	public void eliminar(Horario horario);

}
