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
import javax.persistence.OneToMany;
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
@Table(name = "ft_paradas")
public class Parada implements Serializable{

private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name = "descripcion")
	private String descripcion;
	
	@Column(name = "fecha")
	private LocalDateTime fecha; 
	
	@Column(name = "codVia1")
	private Long codVia1;
	
	@Column(name = "codVia2")
	private Long codVia2;
	
	@Column(name = "habilitada")
	private Boolean habilitada;
	
	@OneToMany(cascade = CascadeType.ALL)
	private List<Horario> horarios;

	//Point geom;

}
