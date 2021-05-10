package bondisuy.dao;

import java.util.List;

import javax.ejb.Singleton;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import bondisuy.entity.Recorrido;

@Singleton
public class RecorridoDAOImpl implements IRecorridoDAO {

	@PersistenceContext(name = "LaboratorioTSIG")
	private EntityManager em;
	
	@Override
	public List<Recorrido> listar(){
		Query consulta = em.createQuery("SELECT r FROM Recorrido r");
		return consulta.getResultList();
	}
	
	@Override
	public Recorrido listarPorId(Long id) {
		return em.find(Recorrido.class, id);
	}
	
	@Override
	public Recorrido crear(Recorrido recorrido) {
		em.persist(recorrido);
		return recorrido;
	}
	
	@Override
	public Recorrido editar(Recorrido recorrido) {
		em.persist(recorrido);
		return recorrido;
	}
	
	@Override
	public void eliminar(Recorrido recorrido) {
		em.remove(recorrido);
	}
	
}
