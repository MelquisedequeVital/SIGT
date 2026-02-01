package br.edu.ifpb.sigt_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ifpb.sigt_backend.model.Tcc;
import br.edu.ifpb.sigt_backend.repository.TccRepository;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tccs")
@CrossOrigin(origins = "http://localhost:4200") // Permite que o Angular acesse o Java
public class TccController {

    @Autowired
    private TccRepository repository;

    @PostMapping
    public ResponseEntity<Tcc> salvar(@Valid @RequestBody Tcc tcc) {
        // O @Valid garante que, se o dado for inválido, o Java barra aqui (Requisito 1)
        return ResponseEntity.ok(repository.save(tcc));
    }
}
