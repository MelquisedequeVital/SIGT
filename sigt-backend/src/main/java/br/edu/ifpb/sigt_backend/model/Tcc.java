package br.edu.ifpb.sigt_backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Entity
public class Tcc {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome é obrigatório")
    @Pattern(regexp = "^[A-Za-zÀ-ÖØ-öø-ÿ\\s'-]+$") // Mesmo Regex do seu Angular
    private String studentName;

    @NotBlank(message = "O título é obrigatório")
    private String title;

    // Adicione os outros campos conforme o seu tcc-model.ts
}
