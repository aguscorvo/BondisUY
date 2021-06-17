package bondisuy.dao;

import java.math.BigInteger;
import java.util.List;

import javax.ejb.Singleton;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.TypedQuery;

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
	public Recorrido crear(Recorrido recorrido, String geometria) {
		Query consulta = em.createNativeQuery("INSERT INTO ft_recorridos (activo, descripcion, fecha, linea_id, geom) VALUES (?, ?, ?, ?, ST_GeometryFromText(?, 32721)) RETURNING id");
		consulta.setParameter(1, recorrido.getActivo());
		consulta.setParameter(2, recorrido.getDescripcion());
		consulta.setParameter(3, recorrido.getFecha());
		consulta.setParameter(4, recorrido.getLinea().getId());
		consulta.setParameter(5, geometria);
		BigInteger id = (BigInteger) consulta.getSingleResult();
		actualizarRecorrido(id.longValue(), recorrido.getLinea().getId());
		recorrido.setId(id.longValue());
		return recorrido;
	}
	
	public void actualizarRecorrido(Long idRecorrido, Long idLinea) {
		Query consulta = em.createNativeQuery("INSERT INTO lineas_ft_recorridos (linea_id, recorridos_id) VALUES (?, ?)");
		consulta.setParameter(1, idLinea);
		consulta.setParameter(2, idRecorrido);
		consulta.executeUpdate();
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
	
	@Override
	public List<Long> listarParadas(Long idRecorrido){
		@SuppressWarnings("unchecked")
		TypedQuery<Long> consulta = (TypedQuery<Long>)
				em.createNativeQuery("SELECT DISTINCT(ph.parada_id) "
						+ "FROM ft_paradas_horarios AS ph "
						+ "INNER JOIN ft_recorridos_horarios AS rh ON ph.horarios_id=rh.horarios_id "
						+ "WHERE rh.recorrido_id=:idRecorrido");
		consulta.setParameter("idRecorrido", idRecorrido);
		return consulta.getResultList();
	} 
	
	@SuppressWarnings("unchecked")
	@Override
	public List<Recorrido> listarActivosPorParada(Long idParada){
		Query consulta = em.createQuery("SELECT r "
				+ "FROM Parada p "
				+ "INNER JOIN Horario h ON p.id=h.parada.id "
				+ "INNER JOIN Recorrido r ON h.recorrido.id=r.id "
				+ "WHERE p.id=:idParada AND r.activo=TRUE");
		consulta.setParameter("idParada", idParada);
		return (List<Recorrido>) consulta.getResultList();
	}
	
}
