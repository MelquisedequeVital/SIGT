package br.edu.ifpb.sigt_backend.repository;

import br.edu.ifpb.sigt_backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // Este é o método que o SecurityFilter está tentando chamar
    // Retornamos UserDetails para que o Spring Security reconheça o objeto
    UserDetails findByLogin(String login);
}