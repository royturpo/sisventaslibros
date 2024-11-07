package com.example.msventa.controller;

import com.example.msventa.entity.CarritoItem;
import com.example.msventa.feign.AuthFeign;
import com.example.msventa.service.CarritoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/carrito")
public class CarritoController {
    @Autowired
    private CarritoService carritoService;
    @Autowired
    private AuthFeign authFeign;

    @PostMapping("/agregar")
    public ResponseEntity<CarritoItem> agregarItem(@RequestHeader("Authorization") String token, @RequestBody CarritoItem item) {
        // Obtener el userId desde el token
        Integer userId = obtenerUserIdDesdeToken(token);
        CarritoItem nuevoItem = carritoService.agregarItem(userId, item.getLibroId(), item.getCantidad());
        return ResponseEntity.ok(nuevoItem);
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarItem(@RequestHeader("Authorization") String token, @PathVariable Integer id) {
        // Obtener el userId desde el token
        Integer userId = obtenerUserIdDesdeToken(token);
        carritoService.eliminarItem(userId, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/listar")
    public ResponseEntity<List<CarritoItem>> listarItems(@RequestHeader("Authorization") String token) {
        // Obtener el userId desde el token
        Integer userId = obtenerUserIdDesdeToken(token);
        List<CarritoItem> items = carritoService.listarItems(userId);
        return ResponseEntity.ok(items);
    }

    private Integer obtenerUserIdDesdeToken(String token) {
        // Aquí llamas al feign client para obtener el userId
        return authFeign.getUserId(token).getBody();
    }
}