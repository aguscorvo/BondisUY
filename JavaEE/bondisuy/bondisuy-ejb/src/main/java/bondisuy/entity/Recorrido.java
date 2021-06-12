package bondisuy.entity;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "ft_recorridos")
public class Recorrido implements Serializable{
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name="descripcion")
	private String descripcion;
	
	@Column(name = "activo")
	private Boolean activo;
	
	@Column(name = "fecha")
	private LocalDateTime fecha; 
	
	@OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "linea_id", referencedColumnName = "id")
	private Linea linea;
	
	@OneToMany(cascade = CascadeType.ALL)
	private List<Horario> horarios;	
	
	//LineString geom;

}
