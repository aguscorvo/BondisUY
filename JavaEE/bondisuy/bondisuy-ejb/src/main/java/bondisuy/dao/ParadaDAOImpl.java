package bondisuy.dao;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;

import javax.ejb.Singleton;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.TemporalType;
import javax.persistence.TypedQuery;

import com.sun.jdi.LongType;

import bondisuy.dto.ProximaLineaDTO;
import bondisuy.entity.Horario;
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
	public Parada crear(Parada parada, String geometria) {
		Query consulta = em.createNativeQuery("INSERT INTO ft_paradas (descripcion, fecha, habilitada, geom) VALUES (?, ?, ?, ST_GeometryFromText(?, 32721))");
		consulta.setParameter(1, parada.getDescripcion());
		consulta.setParameter(2, parada.getFecha());
		consulta.setParameter(3, parada.getHabilitada());
		consulta.setParameter(4, geometria);
		consulta.executeUpdate();
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
	
	@Override
	public List<ProximaLineaDTO> proximasLineas(Long idParada, String horario){
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

    

}
