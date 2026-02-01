package br.edu.ifpb.sigt_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.ifpb.sigt_backend.model.Tcc;

@Repository
public interface TccRepository extends JpaRepository<Tcc, Long> {
}