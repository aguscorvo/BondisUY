package bondisuy.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
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
@Table(name = "administradores")
public class Administrador implements Serializable{
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;	
	@Column(name = "nombre", nullable = false, length = 50)
	private String nombre;
	@Column(name = "apellido", nullable = false, length = 50)
	private String apellido;
	@Column(name = "username", nullable = false, length = 50)
	private String username;
	@Column(name = "password", length = 255)
	private String password;

}
