package bondisuy.entity;

import java.io.Serializable;
import java.time.LocalTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Builder
@Entity
@IdClass(Horario.class)
@Table(name = "horarios")
public class Horario implements Serializable{
	
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "hora", nullable = false)
	private LocalTime hora;
	
	@Id
	@ManyToOne
    @JoinColumn(name = "recorrido_id", 
    	insertable=false,
		updatable=false)
	private Recorrido recorrido;
	
	@Id
	@ManyToOne
    @JoinColumn(name = "parada_id",
    		insertable=false,
			updatable=false)
	private Parada parada;	
	
}
