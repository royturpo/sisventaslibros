package com.example.msbook.service;

import com.example.msbook.entity.Categoria;
import com.example.msbook.entity.Libro;
import com.example.msbook.entity.Provedores;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface LibroService {
    List<Libro> listar();
    Libro guardar(String titulo, String autor, Integer stock, Double precio, Integer categoriaId, Integer provedoresId, MultipartFile file, LocalDate anio);
    Libro editar(Integer id, String titulo, String autor, Integer stock, Double precio, Integer categoriaId, Integer provedoresId, MultipartFile file, LocalDate anio);
    void eliminar(Integer id);
    Optional<Libro> listarPorId(Integer id);
    Libro actualizarStock(Integer id, Integer cantidad);
    List<Libro> listarPorCategoria(Integer categoriaId);
    List<Libro> listarPorAnio(LocalDate anio);
    List<Libro> listarDesdeAnio(LocalDate anio);
}
