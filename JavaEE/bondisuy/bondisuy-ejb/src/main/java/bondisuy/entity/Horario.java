package bondisuy.entity;

import java.io.Serializable;
import java.time.LocalTime;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
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
@Table(name = "horarios")
public class Horario implements Serializable{

private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name = "hora")
	private LocalTime hora;
	
	@OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "recorrido_id", referencedColumnName = "id")
	private Recorrido recorrido;
	
	@OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "parada_id", referencedColumnName = "id")
	private Parada parada;	
	
}
