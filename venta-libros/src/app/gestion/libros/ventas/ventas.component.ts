import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css'
})
export class VentasComponent {
  ventas: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadVentas();
  }

  loadVentas() {
    this.http.get('http://localhost:8095/venta/listar').subscribe((data: any) => {
      this.ventas = data;
    });
  }

  downloadReceipt(id: number) {
    const url = `http://localhost:8095/venta/${id}/recibo`;
    this.http.get(url, { responseType: 'blob' }).subscribe((blob: Blob) => {
      const downloadURL = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = `recibo_${id}.pdf`;
      link.click();
    });
  }

  downloadSalesReport() {
    const url = 'http://localhost:8095/venta/registroVentasPdf';
    this.http.get(url, { responseType: 'blob' }).subscribe((blob: Blob) => {
      const downloadURL = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = 'registro_ventas.pdf';
      link.click();
    });
  }
}
