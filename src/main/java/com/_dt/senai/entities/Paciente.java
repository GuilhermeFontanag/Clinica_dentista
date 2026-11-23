package com._dt.senai.entities;

import jakarta.persistence.*;
@Entity
public class Paciente {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id

    private int id;

    private String nome;

    private String cro;

    private String especialidade;

    private String telefone;

    private String ativo;

    public Paciente(String ativo, String telefone, String especialidade, String cro, String nome, int id) {
        this.ativo = ativo;
        this.telefone = telefone;
        this.especialidade = especialidade;
        this.cro = cro;
        this.nome = nome;
        this.id = id;
    }
    public Paciente(){}

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

    public String getCro() {
        return cro;
    }

    public void setCro(String cro) {
        this.cro = cro;
    }

    public String getEspecialidade() {
        return especialidade;
    }

    public void setEspecialidade(String especialidade) {
        this.especialidade = especialidade;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getAtivo() {
        return ativo;
    }

    public void setAtivo(String ativo) {
        this.ativo = ativo;
    }
}
