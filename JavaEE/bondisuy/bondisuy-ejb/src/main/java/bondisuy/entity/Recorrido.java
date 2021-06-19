package bondisuy.entity;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
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
	
	@ManyToOne(fetch = FetchType.LAZY)
	private Linea linea;
	
	@OneToMany(mappedBy="recorrido", cascade = CascadeType.ALL, orphanRemoval=true)
	private List<Horario> horarios;	
	
}
