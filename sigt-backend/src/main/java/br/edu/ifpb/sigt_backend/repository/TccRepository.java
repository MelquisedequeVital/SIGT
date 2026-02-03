package br.edu.ifpb.sigt_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.ifpb.sigt_backend.model.Tcc;

@Repository
public interface TccRepository extends JpaRepository<Tcc, Long> {
    // Busca na tabela de TCCs onde a coluna mapeada como studentId coincida
    List<Tcc> findByStudentId(String studentId); 
}