package com._dt.senai.controller;

import com._dt.senai.entities.Consulta;
import com._dt.senai.repository.ConsultaRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("api/consulta")
public class ConsultaController {

    private final ConsultaRepository repository;

    public ConsultaController(ConsultaRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public void criar_consulta(@RequestBody Consulta consulta) {
        repository.save(consulta);
    }

    @GetMapping
    public List<Consulta> mostrar() {
        return repository.findAll();
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Integer id) {
        repository.deleteById(id);
    }

    @GetMapping("/{id}")
    public Consulta buscarId(@PathVariable Integer id) {
        return repository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public void atualizar(@PathVariable Integer id, @RequestBody Consulta r) {
        Consulta consulta = repository.getReferenceById(id);
        consulta.setNome(r.getNome());
        consulta.setData(r.getData());
        consulta.setId_dentista(r.getId_dentista());
        consulta.setId_paciente(r.getId_paciente());
        consulta.setMatricula(r.getMatricula());
        consulta.setObservação(r.getObservação());
        consulta.setProcedimento(r.getProcedimento());
        consulta.setTurno(r.getTurno());
        consulta.setStatus(r.getStatus());

        repository.save(consulta);
    }
}
