package bondisuy.dao;

import java.util.List;

import javax.ejb.Singleton;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import bondisuy.entity.Administrador;

@Singleton
public class AdministradorDAOImpl implements IAdministradorDAO {

	@PersistenceContext(name = "LaboratorioTSIG")
	private EntityManager em;
	
	@SuppressWarnings("unchecked")
	@Override
	public List<Administrador> listar(){
		Query consulta = em.createQuery("SELECT a FROM Administrador a");
		return consulta.getResultList();
	}
	
	@Override
	public Administrador listarPorId(Long id) {
		return em.find(Administrador.class, id);
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public Administrador listarPorUsername(String username) {
		Query consulta = em.createQuery("SELECT a FROM Administrador a WHERE a.username = :username");
		consulta.setParameter("username", username);
		return (Administrador) consulta.getResultList().stream().findFirst().orElse(null);
	}
	
	@Override
	public Administrador crear(Administrador administrador) {
		em.persist(administrador);
		return administrador;
	}
	
	@Override
	public Administrador editar(Administrador administrador) {
		em.persist(administrador);
		return administrador;
	}
	
	
	public void eliminar(Administrador administrador) {
		em.remove(administrador);
	}

}
