package com.example.msauth.service;

import com.example.msauth.entity.AuthUser;

public interface VinculacionService {
    AuthUser vincularCliente(Integer userId, Integer clienteId);
    AuthUser vincularVendedor(Integer userId, Integer vendedorId);
}
