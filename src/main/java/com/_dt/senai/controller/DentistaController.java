package com._dt.senai.controller;

import com._dt.senai.entities.Dentista;
import com._dt.senai.repository.DentistaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public void  deletar(@PathVariable Integer id){
        repository.deleteById(id);
    }

    @GetMapping("/{id}")
    public void buscarId(@PathVariable Integer id){
        repository.findById(id);
    }

    @PutMapping("/{id}")
    public void atualizar(@PathVariable Integer id, @RequestBody Dentista d) {
        Dentista dentista = repository.getReferenceById(id);
        dentista.setNome(d.getNome());
        dentista.setCro(d.getCro());
        dentista.setEspecialidade(d.getEspecialidade());
        dentista.setTelefone(d.getTelefone());
        dentista.setAtivo(d.getAtivo());

        repository.save(dentista);
    }
}
