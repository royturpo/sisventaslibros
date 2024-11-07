package com.example.msventa.controller;

import com.example.msventa.dto.LibroDto;
import com.example.msventa.entity.Venta;
import com.example.msventa.entity.VentaDetalle;
import com.example.msventa.feign.LibroFeign;
import com.example.msventa.service.PdfService;
import com.example.msventa.service.VentaService;
import com.itextpdf.text.DocumentException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/venta")
public class VentaController {
    @Autowired
    private VentaService ventaService;
    @Autowired
    private PdfService pdfService;
    @Autowired
    private LibroFeign libroFeign;

    @PostMapping("/realizar")
    public ResponseEntity<Venta> realizarVenta(@RequestHeader("Authorization") String token) {
        Venta nuevaVenta = ventaService.realizarVenta(token);
        return ResponseEntity.ok(nuevaVenta);
    }
    @GetMapping("/listar")
    public ResponseEntity<List<Venta>> listarVentas() {
        List<Venta> ventas = ventaService.listarVentas();
        for (Venta venta : ventas) {
            for (VentaDetalle detalle : venta.getDetalles()) {
                ResponseEntity<LibroDto> libroResponse = libroFeign.listarLibro(detalle.getLibroId());
                if (libroResponse.getStatusCode().is2xxSuccessful()) {
                    detalle.setLibro(libroResponse.getBody());
                }
            }
        }
        return ResponseEntity.ok(ventas);
    }

    @GetMapping("/{id}/recibo")
    public ResponseEntity<byte[]> generarRecibo(@PathVariable Integer id) {
        Venta venta = ventaService.obtenerVentaPorId(id);
        if (venta == null) {
            return ResponseEntity.notFound().build();
        }

        byte[] pdfBytes = null;
        try {
            pdfBytes = pdfService.generarReciboPdf(venta);
        } catch (DocumentException | IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("filename", "recibo_" + id + ".pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
    @GetMapping("/registroVentasPdf")
    public ResponseEntity<byte[]> generarRegistroVentasPdf() {
        List<Venta> ventas = ventaService.listarVentas();
        for (Venta venta : ventas) {
            for (VentaDetalle detalle : venta.getDetalles()) {
                ResponseEntity<LibroDto> libroResponse = libroFeign.listarLibro(detalle.getLibroId());
                if (libroResponse.getStatusCode().is2xxSuccessful()) {
                    detalle.setLibro(libroResponse.getBody());
                }
            }
        }

        byte[] pdfBytes = null;
        try {
            pdfBytes = pdfService.generarRegistroVentasPdf(ventas);
        } catch (DocumentException | IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("filename", "registro_ventas.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}