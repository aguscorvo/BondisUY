package bondisuy.dao;

import java.time.LocalTime;
import java.util.List;

import javax.ejb.Singleton;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import bondisuy.entity.Horario;

@Singleton
public class HorarioDAOImpl implements IHorarioDAO {

	@PersistenceContext(name = "LaboratorioTSIG")
	private EntityManager em;
	
	@SuppressWarnings("unchecked")
	@Override	
	public List<Horario> listar(){
		Query consulta = em.createQuery("SELECT h FROM Horario h");
		return consulta.getResultList();
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public Horario listarPorIds(LocalTime hora, Long recorridoId, Long paradaId) {
		Query consulta = em.createQuery("SELECT h "
				+ "FROM Horario h "
				+ "WHERE h.hora=:hora AND h.parada.id=:paradaId AND h.recorrido.id=:recorridoId");
		consulta.setParameter("hora", hora);
		consulta.setParameter("recorridoId", recorridoId);
		consulta.setParameter("paradaId", paradaId);
		return (Horario) consulta.getResultList().stream().findFirst().orElse(null);
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<Horario> listarPorParadaYRecorrido(Long recorridoId, Long paradaId) {
		Query consulta = em.createQuery("SELECT h "
				+ "FROM Horario h "
				+ "WHERE h.parada.id=:paradaId AND h.recorrido.id=:recorridoId");
		consulta.setParameter("recorridoId", recorridoId);
		consulta.setParameter("paradaId", paradaId);
		return (List<Horario>) consulta.getResultList();
	}
	
	@Override
	public Horario crear(Horario horario) {
		em.persist(horario);
		return horario;
	}
	
	@Override
	public void eliminar(Horario horario) {
		em.remove(horario);
	}
	 

}
