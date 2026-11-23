package com._dt.senai.controller;

import com._dt.senai.entities.Dentista;
import com._dt.senai.repository.DentistaRepository;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController
@RequestMapping("api/dentista")
public class DentistaController {

    private final DentistaRepository repository;
    public DentistaController(DentistaRepository repository) {
        this.repository = repository;
    }
    @PostMapping
    public String criar_dentista(@RequestBody Dentista dentista){
        try {
            repository.save(dentista);
            return "Dentista criado com sucesso";
        }catch (Exception e ){
            return "dados incorretos";
        }
    }

    @GetMapping
    public List<Dentista> mostrar(){
        return repository.findAll();
    }

    @DeleteMapping("/{id}")
    public String deletar(@PathVariable int id){
        repository.deleteById(id);
        return "excluido com sucesso";
    }

    @GetMapping("/{id}")
    public void buscarId(@PathVariable int id){
        repository.findById(id);
    }
    @PutMapping("/{id}")
    public void atualizar(@PathVariable int id, Dentista d ){
        Dentista dentista = repository.getReferenceById(id);
        dentista.setNome(d.getNome());
        dentista.setConvenio(d.getConvenio());
        dentista.setCpf(d.getCpf());
        dentista.setData_nascimento(d.getData_nascimento());
        dentista.setEmail(d.getEmail());
        dentista.setId(d.getId());
        dentista.setObservacoes_clinicas(d.getObservacoes_clinicas());
        dentista.setTelefone(d.getTelefone());

        repository.save(dentista);
    }



}
