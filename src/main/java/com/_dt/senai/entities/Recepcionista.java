package com._dt.senai.entities;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.ZonedDateTime;

@Entity
public class Recepcionista {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private int id;
    private String nome;
    private String matricula;
    private String turno;
    private int id_dentista;
    private int id_paciente;
    private LocalDate data;
    private String procedimento;
    private String status;
    private String observação;

    public Recepcionista(int id, String nome, String matricula, String turno, int id_dentista, int id_paciente, LocalDate data, String procedimento, String status, String observação) {
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

    public Recepcionista() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
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

    public int getId_dentista() {
        return id_dentista;
    }

    public void setId_dentista(int id_dentista) {
        this.id_dentista = id_dentista;
    }

    public int getId_paciente() {
        return id_paciente;
    }

    public void setId_paciente(int id_paciente) {
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
