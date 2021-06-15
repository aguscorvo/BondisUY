package bondisuy.dao;

import java.util.List;

import javax.ejb.Singleton;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.TypedQuery;

import bondisuy.entity.Horario;

@Singleton
public class HorarioDAOImpl implements IHorarioDAO {

	@PersistenceContext(name = "LaboratorioTSIG")
	private EntityManager em;
	
	@Override	
	public List<Horario> listar(){
		Query consulta = em.createQuery("SELECT h FROM Horario h");
		return consulta.getResultList();
	}
	
	@Override
	public Horario listarPorId(Long id) {
		return em.find(Horario.class, id);
	}
	
	@Override
	public Horario crear(Horario horario) {
		em.persist(horario);
		return horario;
	}
	
	@Override
	public Horario editar(Horario horario) {
		em.persist(horario);
		return horario;
	}
	
	@Override
	public void eliminar(Horario horario) {
		em.remove(horario);
	}
	
	@Override
	public List<Long> listarPorParadaYRecorrido(Long paradaId, Long recorridoId) {
		@SuppressWarnings("unchecked")
		TypedQuery<Long>consulta = (TypedQuery<Long>)
				em.createNativeQuery("SELECT h.id "
				+ "FROM horarios AS h "
				+ "INNER JOIN ft_paradas_horarios AS ph ON h.id=ph.horarios_id "
				+ "INNER JOIN ft_recorridos_horarios AS rh ON ph.horarios_id=rh.horarios_id "
				+ "WHERE ph.parada_id=:paradaId AND rh.recorrido_id=:recorridoId");
		consulta.setParameter("paradaId", paradaId);
		consulta.setParameter("recorridoId", recorridoId);
		return consulta.getResultList();
	}    

}
