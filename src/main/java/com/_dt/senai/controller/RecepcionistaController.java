package com._dt.senai.controller;

import com._dt.senai.entities.Recepcionista;
import com._dt.senai.repository.RecepcionistaRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("api/recepcionista")
public class RecepcionistaController {

    private final RecepcionistaRepository repository;

    public RecepcionistaController(RecepcionistaRepository repository) {
        this.repository = repository;
    }


    @PostMapping
    public String criar_dentista(@RequestBody Recepcionista recepcionista){
        try {
            repository.save(recepcionista);
            return "Recepcionista criada com sucesso";
        }catch (Exception e ){
            return "dados incorretos";
        }
    }

    @GetMapping
    public List<Recepcionista> mostrar(){
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
    public void atualizar(@PathVariable int id, Recepcionista r ){
        Recepcionista recepcionista = repository.getReferenceById(id);
       recepcionista.setNome(r.getNome());
       recepcionista.setId(r.getId());
       recepcionista.setData(r.getData());
       recepcionista.setId_dentista(r.getId_dentista());
       recepcionista.setMatricula(r.getMatricula());
       recepcionista.setId(r.getId());
       recepcionista.setObservação(r.getObservação());
       recepcionista.setProcedimento(r.getProcedimento());
       recepcionista.setTurno(r.getTurno());

        repository.save(recepcionista);
    }













}
