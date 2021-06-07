package bondisuy.dao;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import javax.ejb.Singleton;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.TypedQuery;

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
	
	@Override
	public List<ProximaLineaDTO> proximasLineas(Long idParada, String horario){
		//DateTimeFormatter formato = DateTimeFormatter.ofPattern("H:mm:ss");
		LocalTime hora = LocalTime.parse(horario);
		System.out.println(hora);
		TypedQuery<ProximaLineaDTO> proximasLineas = (TypedQuery<ProximaLineaDTO>)
				em.createNativeQuery("SELECT l.nombre, h.hora, h.recorrido_id, r.descripcion "
						+ "FROM horarios h "
						+ "INNER JOIN lineas_ft_recorridos lr ON h.recorrido_id= lr.recorridos_id "
						+ "INNER JOIN ft_recorridos r ON r.id=lr.recorridos_id "
						+ "INNER JOIN lineas l ON lr.linea_id = l.id "
						+ "WHERE h.hora > :hora AND parada_id=:idParada "
						+ "ORDER BY h.hora ASC "
						+ "LIMIT 15");
		proximasLineas.setParameter("hora", hora);
		proximasLineas.setParameter("idParada", idParada);
		return proximasLineas.getResultList();
	}

    

}
