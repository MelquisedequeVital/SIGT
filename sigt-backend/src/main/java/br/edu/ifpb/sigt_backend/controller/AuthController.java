package br.edu.ifpb.sigt_backend.controller;

import br.edu.ifpb.sigt_backend.model.Usuario;
import br.edu.ifpb.sigt_backend.repository.UsuarioRepository;
import br.edu.ifpb.sigt_backend.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder; // Import necessário
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
    private PasswordEncoder passwordEncoder; // Para criptografar a senha

    @PostMapping("/login")
    public ResponseEntity efetuarLogin(@RequestBody DadosAutenticacao dados) {
        var authenticationToken = new UsernamePasswordAuthenticationToken(dados.login(), dados.senha());
        var authentication = manager.authenticate(authenticationToken);
        var tokenJWT = tokenService.gerarToken((Usuario) authentication.getPrincipal());

        return ResponseEntity.ok(new DadosTokenJWT(tokenJWT));
    }

    // NOVO MÉTODO PARA CRIAR USUÁRIOS
    @PostMapping("/register")
    public ResponseEntity registrar(@RequestBody DadosAutenticacao dados) {
        if (repository.findByLogin(dados.login()) != null) {
            return ResponseEntity.badRequest().body("Usuário já existe");
        }

        // Criptografa a senha antes de salvar no banco
        String senhaCriptografada = passwordEncoder.encode(dados.senha());
        
        Usuario novoUsuario = new Usuario();
        novoUsuario.setLogin(dados.login());
        novoUsuario.setSenha(senhaCriptografada);
        novoUsuario.setRole("ROLE_USER"); // Define uma role padrão

        repository.save(novoUsuario);

        return ResponseEntity.ok("Usuário cadastrado com sucesso!");
    }
}

record DadosAutenticacao(String login, String senha) {}
record DadosTokenJWT(String token) {}