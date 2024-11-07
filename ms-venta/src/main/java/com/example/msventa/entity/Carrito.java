package com.example.msventa.entity;

import com.example.msventa.dto.LibroDto;
import jakarta.persistence.*;

@Entity
public class Carrito {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "venta_id")
    private Venta venta;

    @Transient
    private LibroDto libro;

    private Integer cantidad;
}
