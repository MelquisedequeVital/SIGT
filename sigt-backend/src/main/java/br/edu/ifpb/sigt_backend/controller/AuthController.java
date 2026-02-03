package br.edu.ifpb.sigt_backend.controller;

import br.edu.ifpb.sigt_backend.model.Usuario;
import br.edu.ifpb.sigt_backend.repository.UsuarioRepository;
import br.edu.ifpb.sigt_backend.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity efetuarLogin(@RequestBody DadosAutenticacao dados) {
        // Usa a matrícula como o principal identificador no Spring Security
        var authenticationToken = new UsernamePasswordAuthenticationToken(dados.matricula(), dados.senha());
        var authentication = manager.authenticate(authenticationToken);
        
        var tokenJWT = tokenService.gerarToken((Usuario) authentication.getPrincipal());
        return ResponseEntity.ok(new DadosTokenJWT(tokenJWT));
    }

    @PostMapping("/register")
    public ResponseEntity registrar(@RequestBody DadosAutenticacao dados) {
        // Verifica se a matrícula (student_id) já existe no Supabase
        if (repository.findByMatricula(dados.matricula()) != null) {
            return ResponseEntity.badRequest().body("Usuário com esta matrícula já existe");
        }

        String senhaCriptografada = passwordEncoder.encode(dados.senha());
        
        Usuario novoUsuario = new Usuario();
        // Mapeia para a coluna student_id da entidade
        novoUsuario.setMatricula(dados.matricula()); 
        novoUsuario.setSenha(senhaCriptografada);
        novoUsuario.setRole("ROLE_USER");

        repository.save(novoUsuario);
        return ResponseEntity.ok("Usuário cadastrado com sucesso!");
    }
}

// Mova os Records para fora da classe AuthController, mas no mesmo arquivo
record DadosAutenticacao(String senha, String matricula) {}
record DadosTokenJWT(String token) {}