package com.example.msbook.entity;

import com.example.msbook.models.Formato;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Data
public class Provedores {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer id;
    private String nombre;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date entrega;
    private String tipo;

}
