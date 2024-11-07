package com.example.msbook.service.impl;

import com.example.msbook.entity.Categoria;
import com.example.msbook.entity.Libro;
import com.example.msbook.entity.Provedores;
import com.example.msbook.repository.CategoriaRepository;
import com.example.msbook.repository.LibroRepository;
import com.example.msbook.repository.ProvedoresRepository;
import com.example.msbook.service.LibroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class LibroServiceImpl implements LibroService {
    @Autowired
    private LibroRepository libroRepository;
    @Autowired
    private CategoriaRepository categoriaRepository;
    @Autowired
    private ProvedoresRepository provedoresRepository;

    private final Path rootLocation = Paths.get("uploads");

    @Override
    public List<Libro> listar() {
        return libroRepository.findAll();
    }
    @Autowired
    public LibroServiceImpl(LibroRepository libroRepository) {
        this.libroRepository = libroRepository;
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage location", e);
        }
    }

    @Override
    public Libro guardar(String titulo, String autor, Integer stock, Double precio, Integer categoriaId, Integer provedoresId, MultipartFile file, LocalDate anio) {
        String imagenUrl = storeFile(file);
        Categoria categoria = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        Provedores provedores = provedoresRepository.findById(provedoresId)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));

        Libro libro = new Libro();
        libro.setTitulo(titulo);
        libro.setAutor(autor);
        libro.setStock(stock);
        libro.setPrecio(precio);
        libro.setCategoria(categoria);
        libro.setProvedores(provedores);
        libro.setImagenUrl(imagenUrl);
        libro.setAnio(anio);
        return libroRepository.save(libro);
    }

    @Override
    public Libro editar(Integer id, String titulo, String autor, Integer stock, Double precio, Integer categoriaId, Integer provedoresId, MultipartFile file, LocalDate anio) {
        Libro libroExistente = libroRepository.findById(id).orElse(null);
        if (libroExistente == null) {
            throw new RuntimeException("Libro no encontrado");
        }

        if (file != null && !file.isEmpty()) {
            deleteFile(libroExistente.getImagenUrl());
            String imagenUrl = storeFile(file);
            libroExistente.setImagenUrl(imagenUrl);
        }

        Categoria categoria = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        Provedores provedores = provedoresRepository.findById(provedoresId)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));

        libroExistente.setTitulo(titulo);
        libroExistente.setAutor(autor);
        libroExistente.setStock(stock);
        libroExistente.setPrecio(precio);
        libroExistente.setCategoria(categoria);
        libroExistente.setProvedores(provedores);
        libroExistente.setAnio(anio);
        return libroRepository.save(libroExistente);
    }

    @Override
    public void eliminar(Integer id) {
        Libro libroExistente = libroRepository.findById(id).orElse(null);
        if (libroExistente != null) {
            deleteFile(libroExistente.getImagenUrl());
            libroRepository.deleteById(id);
        }
    }
    @Override
    public Optional<Libro> listarPorId(Integer id) {
        return libroRepository.findById(id);
    }
    @Override
    public Libro actualizarStock(Integer id, Integer cantidad) {
        Optional<Libro> optionalLibro = libroRepository.findById(id);
        if (optionalLibro.isPresent()) {
            Libro libro = optionalLibro.get();
            libro.setStock(cantidad);
            return libroRepository.save(libro);
        } else {
            throw new RuntimeException("Libro no encontrado");
        }
    }
    @Override
    public List<Libro> listarPorCategoria(Integer categoriaId) {
        return libroRepository.findByCategoriaId(categoriaId);
    }

    @Override
    public List<Libro> listarPorAnio(LocalDate anio) {
        return libroRepository.findByAnio(anio);
    }

    @Override
    public List<Libro> listarDesdeAnio(LocalDate anio) {
        return libroRepository.findByAnioAfter(anio);
    }

    private String storeFile(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Failed to store empty file.");
            }
            String fileExtension = getFileExtension(file.getOriginalFilename());
            if (!isValidImageFile(fileExtension)) {
                throw new RuntimeException("Invalid file type. Only JPG, PNG and JPEG are allowed.");
            }
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), this.rootLocation.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
            return fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file.", e);
        }
    }

    private void deleteFile(String fileName) {
        try {
            Path filePath = rootLocation.resolve(fileName);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file.", e);
        }
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            return "";
        }
        int dotIndex = fileName.lastIndexOf('.');
        return (dotIndex == -1) ? "" : fileName.substring(dotIndex + 1);
    }

    private boolean isValidImageFile(String fileExtension) {
        return "jpg".equalsIgnoreCase(fileExtension) ||
                "png".equalsIgnoreCase(fileExtension) ||
                "jpeg".equalsIgnoreCase(fileExtension);
    }
}
