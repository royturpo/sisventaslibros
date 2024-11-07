package com.example.msbook.repository;

import com.example.msbook.entity.Libro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Repository
public interface LibroRepository extends JpaRepository<Libro, Integer> {
    List<Libro> findByCategoriaId(Integer categoriaId);
    List<Libro> findByAnio(LocalDate anio);
    List<Libro> findByAnioAfter(LocalDate anio);
}
