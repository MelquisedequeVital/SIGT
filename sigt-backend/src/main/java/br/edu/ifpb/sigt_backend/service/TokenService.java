package br.edu.ifpb.sigt_backend.service;

import br.edu.ifpb.sigt_backend.model.Usuario;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secret;

    // Gera o Token JWT para o utilizador
    public String gerarToken(Usuario usuario) {
        // Na v0.12.x usamos SecretKey e o método .subject() (sem o prefixo 'set')
        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        
        return Jwts.builder()
                .subject(usuario.getUsername()) // Mudou de setSubject para subject
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 86400000)) // 24h
                .signWith(key) // O algoritmo HS256 é detectado automaticamente pela chave
                .compact();
    }

    // Extrai o utilizador do Token
    public String getSubject(String token) {
        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        
        return Jwts.parser() // Mudou de parserBuilder para parser
                .verifyWith(key) // Mudou de setSigningKey para verifyWith
                .build()
                .parseSignedClaims(token) // Mudou de parseClaimsJws para parseSignedClaims
                .getPayload() // Mudou de getBody para getPayload
                .getSubject();
    }
}