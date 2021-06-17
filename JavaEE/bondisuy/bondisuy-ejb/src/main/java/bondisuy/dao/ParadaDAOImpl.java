package bondisuy.dao;

import java.time.LocalTime;
import java.util.List;

import javax.ejb.Singleton;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.TypedQuery;

import bondisuy.dto.ProximaLineaDTO;
import bondisuy.entity.Parada;

@Singleton
public class ParadaDAOImpl implements IParadaDAO {
	
	@PersistenceContext(name = "LaboratorioTSIG")
	private EntityManager em;
	
	@SuppressWarnings("unchecked")
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
	public Parada crear(Parada parada, String geometria) {
		Query consulta = em.createNativeQuery("INSERT INTO ft_paradas (descripcion, fecha, habilitada, geom) VALUES (?, ?, ?, ST_GeometryFromText(?, 32721))");
		consulta.setParameter(1, parada.getDescripcion());
		consulta.setParameter(2, parada.getFecha());
		consulta.setParameter(3, parada.getHabilitada());
		consulta.setParameter(4, geometria);
		consulta.executeUpdate();
	
		//Se busca parada insertada para obtener el ID
		Query busqueda = em.createQuery("SELECT p FROM Parada p "
				+ "WHERE p.descripcion = :descripcion "
				+ "AND p.fecha = :fecha "
				+ "AND p.habilitada = :habilitada");
		
		busqueda.setParameter("descripcion", parada.getDescripcion());
		busqueda.setParameter("fecha", parada.getFecha());
		busqueda.setParameter("habilitada", parada.getHabilitada());
		
		@SuppressWarnings("unchecked")
		List<Parada> lp = busqueda.getResultList();
		
		//return parada;
		return lp.get(0);
	}
	
	@Override
	public Parada editar(Parada parada) {
		em.persist(parada);
		return parada;
	}
	
	@Override
	public void editarGeom(Long id, String geometria) {
		Query consulta = em.createNativeQuery("UPDATE ft_paradas p SET geom = ST_GeometryFromText(:geometria, 32721)"
				+ " WHERE p.id=:id");
		consulta.setParameter("id", id);
		consulta.setParameter("geometria", geometria);
		consulta.executeUpdate();
	}
	
	@Override
	public void eliminar(Parada parada) {
		em.remove(parada);
	}
	
	@Override
	public List<ProximaLineaDTO> proximasLineas(Long idParada, String horario){
		@SuppressWarnings("unchecked")
		TypedQuery<ProximaLineaDTO> proximasLineas = (TypedQuery<ProximaLineaDTO>)
				em.createNativeQuery("SELECT l.nombre, to_char(h.hora, 'HH24:MI:ss'), h.recorrido_id, r.descripcion "
						+ "FROM horarios h "
						+ "INNER JOIN lineas_ft_recorridos lr ON h.recorrido_id= lr.recorridos_id "
						+ "INNER JOIN ft_recorridos r ON r.id=lr.recorridos_id "
						+ "INNER JOIN lineas l ON lr.linea_id = l.id "
						+ "WHERE h.hora > :hora AND parada_id=:idParada "
						+ "ORDER BY h.hora ASC "
						+ "LIMIT 15");
		proximasLineas.setParameter("hora", LocalTime.parse(horario));
		proximasLineas.setParameter("idParada", idParada);
		return proximasLineas.getResultList();
	}
	
	
	@SuppressWarnings("unchecked")
	@Override
	public List<Parada> listarPorRecorrido(Long idRecorrido){
		Query consulta = em.createQuery("SELECT DISTINCT(p) "
				+ "FROM Parada p "
				+ "INNER JOIN Horario h ON p.id=h.parada.id "
				+ "INNER JOIN Recorrido r ON h.recorrido.id=r.id "
				+ "WHERE r.id=:idRecorrido");
		consulta.setParameter("idRecorrido", idRecorrido);
		return (List<Parada>) consulta.getResultList();
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public String getGeom(Long id) {
		Query consulta = em.createNativeQuery("SELECT st_astext(p.geom) "
				+ "FROM ft_paradas p "
				+ "WHERE p.id=:id");
		consulta.setParameter("id", id);
		return (String) consulta.getResultList().stream().findFirst().orElse(null);
	}
	
}
