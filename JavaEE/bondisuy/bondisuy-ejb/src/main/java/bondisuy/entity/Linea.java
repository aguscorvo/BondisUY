package bondisuy.entity;

import java.io.Serializable;
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
@Table(name = "lineas")
public class Linea implements Serializable{

	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name = "nombre", nullable = false, length = 50)
	private String nombre;
	
	@Column(name = "origen", nullable = false, length = 50)
	private String origen;
	
	@Column(name = "destino", nullable = false, length = 50)
	private String destino;
	
	@OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "compania_id", referencedColumnName = "id")
	private Compania compania;	
	
	@OneToMany(cascade = CascadeType.ALL)
	private List<Recorrido> recorridos;
	
}
