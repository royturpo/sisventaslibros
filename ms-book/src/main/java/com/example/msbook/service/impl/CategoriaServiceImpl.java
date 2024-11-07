package com.example.msbook.service.impl;

import com.example.msbook.entity.Categoria;
import com.example.msbook.repository.CategoriaRepository;
import com.example.msbook.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaServiceImpl implements CategoriaService {
    @Autowired
    private CategoriaRepository categoriaRepository;
    @Override
    public List<Categoria> listar(){
        return categoriaRepository.findAll();
    }
    @Override
    public Categoria guardar(Categoria categoria){
        return categoriaRepository.save(categoria);
    }
    @Override
    public Categoria editar(Categoria categoria, Integer id) {
        if (categoriaRepository.existsById(id)) {
            categoria.setId(id);
            return categoriaRepository.save(categoria);

        }
        return null;
    }
    @Override
    public void eliminar(Integer id){
         categoriaRepository.deleteById(id);

    }
    @Override
    public Optional<Categoria> listarPorId(Integer id) {
        return categoriaRepository.findById(id);
    }
}
