package com.example.msventa.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

@Data
public class LibroDto {
    private Integer id;
    private String titulo;
    private String autor;
    private Integer stock;
    private Double precio;
}
