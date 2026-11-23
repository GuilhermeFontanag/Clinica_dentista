package com._dt.senai.entities;

import jakarta.persistence.*;

import java.time.LocalDate;
@Entity
public class Dentista{
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
   private int id;
   private String nome;
   private String cpf;
   private String email;
   private String telefone;
   private LocalDate data_nascimento;
   private String convenio;
   private String observacoes_clinicas;

    public Dentista(int id, String nome, String cpf, String email, String telefone, LocalDate data_nascimento, String convenio, String observacoes_clinicas) {
        this.id = id;
        this.nome = nome;
        this.cpf = cpf;
        this.email = email;
        this.telefone = telefone;
        this.data_nascimento = data_nascimento;
        this.convenio = convenio;
        this.observacoes_clinicas = observacoes_clinicas;
    }

    public Dentista(){}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome (String nome) {
        this.nome= nome;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public LocalDate getData_nascimento() {
        return data_nascimento;
    }

    public void setData_nascimento(LocalDate data_nascimento) {
        this.data_nascimento = data_nascimento;
    }

    public String getConvenio() {
        return convenio;
    }

    public void setConvenio(String convenio) {
        this.convenio = convenio;
    }

    public String getObservacoes_clinicas() {
        return observacoes_clinicas;
    }

    public void setObservacoes_clinicas(String observacoes_clinicas) {
        this.observacoes_clinicas = observacoes_clinicas;
    }
}
