package bondisuy.dao;

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
    

}
