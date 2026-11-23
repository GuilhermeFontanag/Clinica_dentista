package com._dt.senai.entities;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Consulta {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Integer id;
    private Integer id_paciente;
    private Integer id_dentista;
    private String nome;
    private String matricula;
    private String turno;
    private LocalDate data;
    private String procedimento;
    private String status;
    private String observação;

    public Consulta(Integer id, String nome, String matricula, String turno, Integer id_dentista, Integer id_paciente, LocalDate data, String procedimento, String status, String observação) {
        this.id = id;
        this.nome = nome;
        this.matricula = matricula;
        this.turno = turno;
        this.id_dentista = id_dentista;
        this.id_paciente = id_paciente;
        this.data = data;
        this.procedimento = procedimento;
        this.status = status;
        this.observação = observação;
    }

    public Consulta() {}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    public String getTurno() {
        return turno;
    }

    public void setTurno(String turno) {
        this.turno = turno;
    }

    public Integer getId_dentista() {
        return id_dentista;
    }

    public void setId_dentista(Integer id_dentista) {
        this.id_dentista = id_dentista;
    }

    public Integer getId_paciente() {
        return id_paciente;
    }

    public void setId_paciente(Integer id_paciente) {
        this.id_paciente = id_paciente;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public String getProcedimento() {
        return procedimento;
    }

    public void setProcedimento(String procedimento) {
        this.procedimento = procedimento;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getObservação() {
        return observação;
    }

    public void setObservação(String observação) {
        this.observação = observação;
    }
}
