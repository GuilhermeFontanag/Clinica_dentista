package com._dt.senai.repository;

import com._dt.senai.entities.Dentista;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DentistaRepository extends JpaRepository <Dentista, Integer> {
}
