package com.example.msventa.dto;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import java.util.Date;

public class CategoriaDto {
    private Integer id;
    private String nombre;
    private String clasificacion;
    private String formato;
    private String idioma;
    private Date año;
}
