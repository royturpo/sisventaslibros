package com.example.mscliente.repository;

import com.example.mscliente.entity.Vendedor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VendedorRepository extends JpaRepository<Vendedor,Integer> {
}
