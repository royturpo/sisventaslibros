package com.example.msbook.service;

import com.example.msbook.entity.Categoria;
import com.example.msbook.entity.Provedores;

import java.util.List;
import java.util.Optional;

public interface ProvedoresService {
    public List<Provedores> listar();
    public Provedores guardar(Provedores provedores);
    public Provedores editar(Provedores provedores, Integer id);
    public void eliminar(Integer id);
    public Optional<Provedores> listarPorId(Integer id);
}
