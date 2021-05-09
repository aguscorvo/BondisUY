package bondisuy.dao;

import java.util.List;
import javax.ejb.Singleton;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import bondisuy.entity.Compania;

@Singleton
public class CompaniaDAOImpl implements ICompaniaDAO {

	@PersistenceContext(name = "LaboratorioTSIG")
	private EntityManager em;
	
	@Override
	public List<Compania> listar() {
		Query consulta = em.createQuery("SELECT c FROM Compania c");
		return consulta.getResultList();
	}

	@Override
	public Compania listarPorId(Long id) {
		return em.find(Compania.class, id);
	}

	@Override
	public Compania crear(Compania compania) {
		em.persist(compania);
		return compania;
	}

	@Override
	public Compania editar(Compania compania) {
		em.persist(compania);
		return compania;
	}

	@Override
	public void eliminar(Compania compania) {
		em.remove(compania);
	}

}
