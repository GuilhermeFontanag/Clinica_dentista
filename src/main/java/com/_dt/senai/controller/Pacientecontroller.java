package com._dt.senai.controller;

import com._dt.senai.entities.Paciente;
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
    public void  criar_Paciente(@RequestBody Paciente paciente){
            repository.save(paciente);
    }    
       
    

    @GetMapping
    public List<Paciente> mostrar(){
        return repository.findAll();
    }

    @DeleteMapping("/{id}")
    public String deletar(@PathVariable Integer id){
        repository.deleteById(id);
        return "excluido com sucesso";
    }

    @GetMapping("/{id}")
    public void buscarId(@PathVariable Integer id){
        repository.findById(id);
    }

    @PutMapping("/{id}")
    public void atualizar(@PathVariable Integer id, @RequestBody Paciente d) {
        Paciente paciente = repository.getReferenceById(id);
        paciente.setNome(d.getNome());
        paciente.setCpf(d.getCpf());
        paciente.setEmail(d.getEmail());
        paciente.setTelefone(d.getTelefone());
        paciente.setData_nascimento(d.getData_nascimento());
        paciente.setConvenio(d.getConvenio());
        paciente.setObservacoes_clinicas(d.getObservacoes_clinicas());

        repository.save(paciente);
    }
}
