package com.example.msbook.entity;

import com.example.msbook.models.Formato;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Data
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer id;
    private String nombre;
    private String clasificacion;
    @Enumerated(EnumType.STRING)
    private Formato formato;
    private String idioma;


}

