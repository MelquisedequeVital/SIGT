package br.edu.ifpb.sigt_backend.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
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

    @NotBlank(message = "O nome do estudante é obrigatório")
    @Pattern(regexp = "^[A-Za-zÀ-ÖØ-öø-ÿ\\s'-]+$", message = "Nome inválido")
    private String studentName;

    @NotBlank(message = "A matrícula é obrigatória")
    @Pattern(regexp = "^[0-9]{5,11}$", message = "A matrícula deve conter entre 5 e 11 números")
    private String studentId;

    @NotBlank(message = "O nome do orientador é obrigatório")
    private String advisorName;

    @NotBlank(message = "O título é obrigatório")
    private String title;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @NotBlank
    private String status; // 'cadastrada' | 'aprovada' | 'reprovada'

    @NotBlank
    private String modality; // 'presencial' | 'remoto'

    private String scheduledDate;
    
    private String scheduledTime;

    private String location;

    @ElementCollection // Para salvar a lista de membros da banca (committee)
    private List<String> committee;

    // Construtores, Getters e Setters
    public Tcc() {}

    // Getters e Setters (Você pode usar o Lombok @Data se preferir)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getAdvisorName() { return advisorName; }
    public void setAdvisorName(String advisorName) { this.advisorName = advisorName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getModality() { return modality; }
    public void setModality(String modality) { this.modality = modality; }

    public String getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(String scheduledDate) { this.scheduledDate = scheduledDate; }

    public String getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(String scheduledTime) { this.scheduledTime = scheduledTime; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public List<String> getCommittee() { return committee; }
    public void setCommittee(List<String> committee) { this.committee = committee; }
}
