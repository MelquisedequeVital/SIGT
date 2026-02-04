package br.edu.ifpb.sigt_backend.infra_exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.persistence.EntityNotFoundException;

@RestControllerAdvice
public class TratadorDeErros {

    // Logger para registrar o erro técnico apenas no console do servidor
    private static final Logger logger = LoggerFactory.getLogger(TratadorDeErros.class);

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity tratarErro404() {
        return ResponseEntity.notFound().build();
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity tratarErroBadCredentials() {
        return ResponseEntity.status(401).body(new DadosErro("Credenciais inválidas."));
    }

    // Aqui tratamos a PSQLException e violações de banco (Ex: matrícula duplicada)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity tratarErroIntegridade(DataIntegrityViolationException ex) {
        // Logamos o erro detalhado no servidor para o desenvolvedor ver
        logger.error("Erro de integridade no banco de dados: {}", ex.getMessage());
        
        // Enviamos uma mensagem genérica e segura para o Melqui no frontend
        return ResponseEntity.badRequest().body(new DadosErro("Dados inválidos ou já cadastrados no sistema."));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity tratarErro500(Exception ex) {
        logger.error("Erro interno não tratado: ", ex);
        return ResponseEntity.status(500).body(new DadosErro("Erro interno no servidor. Tente novamente mais tarde."));
    }
}
