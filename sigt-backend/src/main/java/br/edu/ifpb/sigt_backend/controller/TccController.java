package br.edu.ifpb.sigt_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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

    @GetMapping
    public List<Tcc> listarTodos() {
        return repository.findAll();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tcc> atualizar(@PathVariable Long id, @Valid @RequestBody Tcc tccAtualizado) {
        return repository.findById(id).map(tccExistente -> {
            // 1. Atualiza os campos simples
            tccExistente.setTitle(tccAtualizado.getTitle());
            tccExistente.setStudentName(tccAtualizado.getStudentName());
            tccExistente.setAdvisorName(tccAtualizado.getAdvisorName());
            tccExistente.setStatus(tccAtualizado.getStatus());
            tccExistente.setModality(tccAtualizado.getModality());
            tccExistente.setScheduledDate(tccAtualizado.getScheduledDate());
            tccExistente.setScheduledTime(tccAtualizado.getScheduledTime());
            tccExistente.setLocation(tccAtualizado.getLocation());

            // 2. O SEGREDO DA BANCA: Não use tccExistente.setCommittee(tccAtualizado.getCommittee())
            // Limpe a lista existente e adicione a nova para o Hibernate não se perder nos IDs
            tccExistente.getCommittee().clear();
            if (tccAtualizado.getCommittee() != null) {
                tccExistente.getCommittee().addAll(tccAtualizado.getCommittee());
            }

            Tcc salvo = repository.save(tccExistente);
            return ResponseEntity.ok(salvo);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
