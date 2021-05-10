package bondisuy.dao;

import java.util.List;

import javax.ejb.LocalBean;
import javax.ejb.Singleton;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import bondisuy.entity.Linea;


@Singleton
public class LineaDAOImpl implements ILineaDAO {

	@PersistenceContext(name = "LaboratorioTSIG")
	private EntityManager em;
	
	@Override
	public List<Linea> listar(){
		Query consulta = em.createQuery("SELECT l FROM Linea l");
		return consulta.getResultList();
	}
	
	@Override
	public Linea listarPorId(Long id) {
		return em.find(Linea.class, id);
	}
	
	@Override
	public Linea crear(Linea linea) {
		em.persist(linea);
		return linea;
	}
	
	@Override
	public Linea editar(Linea linea) {
		em.persist(linea);
		return linea;
	}
	
	@Override
	public void eliminar(Linea linea) {
		em.remove(linea);
	}	
    

}
