package com.example.msventa.service.impl;

import com.example.msventa.dto.LibroDto;
import com.example.msventa.entity.CarritoItem;
import com.example.msventa.entity.Venta;
import com.example.msventa.entity.VentaDetalle;
import com.example.msventa.feign.AuthFeign;
import com.example.msventa.feign.LibroFeign;
import com.example.msventa.repository.CarritoItemRepository;
import com.example.msventa.repository.VentaRepository;
import com.example.msventa.service.VentaService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class VentaServiceImpl implements VentaService {
    private static final double IGV = 0.18;
    @Autowired
    private VentaRepository ventaRepository;

    @Autowired
    private CarritoItemRepository carritoItemRepository;

    @Autowired
    private AuthFeign authFeign;
    @Autowired
    private LibroFeign libroFeign;

    @Override
    @Transactional
    public Venta realizarVenta(String token) {
        Integer userId = authFeign.getUserId(token).getBody();
        List<CarritoItem> items = carritoItemRepository.findByUserId(userId);

        if (items.isEmpty()) {
            throw new RuntimeException("El carrito está vacío");
        }

        Venta venta = new Venta();
        venta.setUserId(userId);
        venta.setFecha(new Date());

        double total = 0;

        for (CarritoItem item : items) {
            ResponseEntity<LibroDto> libroResponse = libroFeign.listarLibro(item.getLibroId());
            if (libroResponse.getStatusCode().is2xxSuccessful()) {
                LibroDto libro = libroResponse.getBody();
                if (libro.getStock() < item.getCantidad()) {
                    throw new RuntimeException("No hay suficiente stock para el libro: " + libro.getTitulo());
                }

                VentaDetalle detalle = new VentaDetalle();
                detalle.setVenta(venta);
                detalle.setLibroId(libro.getId());
                detalle.setCantidad(item.getCantidad());
                detalle.setPrecio(libro.getPrecio());
                detalle.setLibro(libro);  // Establecer la información del libro
                venta.getDetalles().add(detalle);

                libroFeign.actualizarStock(libro.getId(), libro.getStock() - item.getCantidad());
                total += libro.getPrecio() * item.getCantidad();
            } else {
                throw new RuntimeException("No se pudo obtener información del libro con ID: " + item.getLibroId());
            }
        }

        double igv = total * IGV;
        double totalConIgv = total + igv;

        venta.setTotal(total);
        venta.setIgv(igv);
        venta.setTotalConIgv(totalConIgv);

        venta = ventaRepository.save(venta);
        carritoItemRepository.deleteAll(items);

        return venta;
    }

    @Override
    public List<Venta> listarVentas() {
        return ventaRepository.findAll();
    }
    @Override
    public Venta obtenerVentaPorId(Integer id) {
        return ventaRepository.findById(id).orElse(null);
    }
    @Override
    public Venta obtenerVentaConDetalles(Integer ventaId) {
        Venta venta = ventaRepository.findById(ventaId).orElseThrow(() -> new RuntimeException("Venta no encontrada"));
        for (VentaDetalle detalle : venta.getDetalles()) {
            ResponseEntity<LibroDto> libroResponse = libroFeign.listarLibro(detalle.getLibroId());
            if (libroResponse.getStatusCode().is2xxSuccessful()) {
                LibroDto libro = libroResponse.getBody();
                detalle.setLibro(libro);
            } else {
                throw new RuntimeException("No se pudo obtener información del libro con ID: " + detalle.getLibroId());
            }
        }
        return venta;
    }

}
