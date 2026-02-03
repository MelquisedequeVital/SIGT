package br.edu.ifpb.sigt_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ifpb.sigt_backend.model.Usuario;
import br.edu.ifpb.sigt_backend.repository.UsuarioRepository;
import br.edu.ifpb.sigt_backend.service.TokenService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

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
    public ResponseEntity login(@RequestBody @Valid DadosAutenticacao dados, HttpServletResponse response) {
        var authenticationToken = new UsernamePasswordAuthenticationToken(dados.matricula(), dados.senha());
        var authentication = manager.authenticate(authenticationToken);
        var tokenJWT = tokenService.gerarToken((Usuario) authentication.getPrincipal());

        // Criando o Cookie HttpOnly [Requisito 4]
        Cookie cookie = new Cookie("token", tokenJWT);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);  // Em produção (HTTPS) deve ser true
        cookie.setPath("/");
        cookie.setMaxAge(7200);   // 2 horas

        response.addCookie(cookie);

        return ResponseEntity.ok().build();
    }

    // NOVO MÉTODO: Realiza o logout limpando o cookie no navegador
    @PostMapping("/logout")
    public ResponseEntity logout(HttpServletResponse response) {
        // O nome tem que ser EXATAMENTE "token"
        Cookie cookie = new Cookie("token", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/"); // OBRIGATÓRIO: deve ser o mesmo path do login
        cookie.setMaxAge(0);  // OBRIGATÓRIO: diz ao navegador para deletar AGORA

        response.addCookie(cookie);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/register")
    public ResponseEntity registrar(@RequestBody DadosAutenticacao dados) {
        if (repository.findByMatricula(dados.matricula()) != null) {
            return ResponseEntity.badRequest().body("Usuário com esta matrícula já existe");
        }

        String senhaCriptografada = passwordEncoder.encode(dados.senha());

        Usuario novoUsuario = new Usuario();
        novoUsuario.setMatricula(dados.matricula());
        novoUsuario.setSenha(senhaCriptografada);
        novoUsuario.setRole("ROLE_USER");

        repository.save(novoUsuario);
        return ResponseEntity.ok("Usuário cadastrado com sucesso!");
    }
}

record DadosAutenticacao(String senha, String matricula) {

}

record DadosTokenJWT(String token) {

}
