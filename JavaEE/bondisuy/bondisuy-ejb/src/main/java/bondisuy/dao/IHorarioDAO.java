package bondisuy.dao;

import java.time.LocalTime;
import java.util.List;

import javax.ejb.Local;

import bondisuy.entity.Horario;

@Local
public interface IHorarioDAO {
	
	public List<Horario> listar();
	public Horario listarPorIds(LocalTime hora, Long recorridoId, Long paradaId);
	public List<Horario> listarPorRecorridoYParada(Long recorridoId, Long paradaId);
	public Horario crear(Horario horario);
	public void eliminar(Horario horario);

}
