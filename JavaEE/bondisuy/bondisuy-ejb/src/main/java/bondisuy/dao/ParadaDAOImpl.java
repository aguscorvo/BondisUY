package bondisuy.dao;

import java.util.List;

import javax.ejb.Singleton;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import bondisuy.entity.Parada;

@Singleton
public class ParadaDAOImpl implements IParadaDAO {
	
	@PersistenceContext(name = "LaboratorioTSIG")
	private EntityManager em;
	
	@Override
	public List<Parada> listar(){
		Query consulta = em.createQuery("SELECT p FROM Parada p");
		return consulta.getResultList();
	}
	
	@Override
	public Parada listarPorId(Long id) {
		return em.find(Parada.class, id);
	}
	
	@Override
	public Parada crear(Parada parada) {
		em.persist(parada);
		return parada;
	}
	
	@Override
	public Parada editar(Parada parada) {
		em.persist(parada);
		return parada;
	}
	
	@Override
	public void eliminar(Parada parada) {
		em.remove(parada);
	}
    

}
