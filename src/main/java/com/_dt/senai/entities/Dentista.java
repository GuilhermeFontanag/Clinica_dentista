package com._dt.senai.entities;

import jakarta.persistence.*;

@Entity
public class Dentista {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Integer id;

    private String nome;

    private String cro;

    private String especialidade;

    private String telefone;

    private String ativo;

    public Dentista(Integer id, String nome, String cro, String especialidade, String telefone, String ativo) {
        this.id = id;
        this.nome = nome;
        this.cro = cro;
        this.especialidade = especialidade;
        this.telefone = telefone;
        this.ativo = ativo;
    }

    public Dentista() {}

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
