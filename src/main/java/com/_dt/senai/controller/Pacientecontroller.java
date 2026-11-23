package com._dt.senai.controller;

import com._dt.senai.entities.Paciente;
import com._dt.senai.repository.DentistaRepository;
import com._dt.senai.repository.PacienteRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/paciente")
public class Pacientecontroller {

    private final PacienteRepository repository;
    public Pacientecontroller(PacienteRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public String criar_Paciente(@RequestBody Paciente paciente){
        try {
            repository.save(paciente);
            return "Paciente criado com sucesso";
        }catch (Exception e ){
            return "dados incorretos";
        }
    }

    @GetMapping
    public List<Paciente> mostrar(){
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
    public void atualizar(@PathVariable int id, Paciente d ){
        Paciente paciente = repository.getReferenceById(id);
        paciente.setNome(d.getNome());
        paciente.setAtivo(d.getAtivo());
        paciente.setCro(d.getCro());
        paciente.setEspecialidade(d.getEspecialidade());
        paciente.setId(d.getId());
        paciente.setTelefone(d.getTelefone());
        repository.save(paciente);
    }





}
