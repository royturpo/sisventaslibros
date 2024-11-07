package com.example.msbook.controller;

import com.example.msbook.entity.Libro;
import com.example.msbook.service.LibroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/libros")
public class LibroController {
    private final Path rootLocation = Paths.get("uploads");
    @Autowired
    private LibroService libroService;

    @GetMapping
    public List<Libro> listarLibros() {
        return libroService.listar();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Libro> crearLibro(
            @RequestParam("titulo") String titulo,
            @RequestParam("autor") String autor,
            @RequestParam("stock") Integer stock,
            @RequestParam("precio") Double precio,
            @RequestParam("categoriaId") Integer categoriaId,
            @RequestParam("provedoresId") Integer provedoresId,
            @RequestParam("anio") int anio,
            @RequestParam("imagen") MultipartFile imagen) {
        LocalDate fechaAnio = LocalDate.of(anio, 1, 1);
        Libro savedLibro = libroService.guardar(titulo, autor, stock, precio, categoriaId, provedoresId, imagen, fechaAnio);
        return ResponseEntity.ok(savedLibro);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Libro> editarLibro(
            @PathVariable Integer id,
            @RequestParam("titulo") String titulo,
            @RequestParam("autor") String autor,
            @RequestParam("stock") Integer stock,
            @RequestParam("precio") Double precio,
            @RequestParam("categoriaId") Integer categoriaId,
            @RequestParam("provedoresId") Integer provedoresId,
            @RequestParam("anio") int anio,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen) {
        LocalDate fechaAnio = LocalDate.of(anio, 1, 1);
        Libro updatedLibro = libroService.editar(id, titulo, autor, stock, precio, categoriaId, provedoresId, imagen, fechaAnio);
        return ResponseEntity.ok(updatedLibro);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarLibro(@PathVariable Integer id) {
        libroService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public Optional<Libro> listarlibroId(@PathVariable Integer id) {
        return libroService.listarPorId(id);
    }
    @PutMapping("/{id}/stock")
    public ResponseEntity<Libro> actualizarStock(@PathVariable Integer id, @RequestParam Integer cantidad) {
        Libro libro = libroService.actualizarStock(id, cantidad);
        return ResponseEntity.ok(libro);
    }
    @GetMapping("/categoria/{categoriaId}")
    public List<Libro> listarLibrosPorCategoria(@PathVariable Integer categoriaId) {
        return libroService.listarPorCategoria(categoriaId);
    }

    @GetMapping("/anio/{anio}")
    public List<Libro> listarLibrosPorAnio(@PathVariable int anio) {
        return libroService.listarPorAnio(LocalDate.of(anio, 1, 1));
    }

    @GetMapping("/anio/desde/{anio}")
    public List<Libro> listarLibrosDesdeAnio(@PathVariable int anio) {
        return libroService.listarDesdeAnio(LocalDate.of(anio, 01, 01));
    }

    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path file = rootLocation.resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                throw new RuntimeException("Could not read file: " + filename);
            }
        } catch (Exception e) {
            throw new RuntimeException("Could not read file: " + filename, e);
        }
    }

}
