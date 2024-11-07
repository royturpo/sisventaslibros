import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-precompra',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './precompra.component.html',
  styleUrl: './precompra.component.css'
})
export class PrecompraComponent {
  cartItems: CartItem[] = [];
  regiones = ['Lima', 'Juliaca', 'Puno', 'Cusco', 'La Libertad'];
  distritos = ['Santa Anita', 'Comas', 'San Isidro'];
  selectedRegion = '';
  selectedDistrict = '';
  shippingCost = 0;
  subtotal = 0;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.http.get<CartItem[]>('http://localhost:8095/carrito/listar')
      .subscribe(
        (data: CartItem[]) => {
          this.cartItems = data;
          this.loadBookDetails();
        },
        (error) => {
          console.error('Error al obtener los items del carrito:', error);
        }
      );
  }

  loadBookDetails(): void {
    this.cartItems.forEach(item => {
      this.http.get<any>(`http://localhost:8095/libros/${item.libroId}`)
        .subscribe(
          (bookDetails) => {
            item.image = bookDetails.imagenUrl;
            item.title = bookDetails.titulo;
            item.price = bookDetails.precio;
            item.description = bookDetails.autor;
            this.calculateSubtotal();
          },
          (error) => {
            console.error('Error al obtener los detalles del libro:', error);
          }
        );
    });
  }

  calculateSubtotal(): void {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + (item.price || 0) * item.cantidad, 0);
  }

  calculateShippingCost(): void {
    if (this.selectedRegion === 'Lima') {
      this.shippingCost = 12;
    } else {
      this.shippingCost = 20;
    }
  }

  finalizePurchase(): void {
    this.http.post('http://localhost:8095/venta/realizar', {})
      .subscribe(
        (venta: any) => {
          console.log('Compra realizada con éxito:', venta);
          this.descargarRecibo(venta.id);
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Error al realizar la compra:', error);
        }
      );
  }

  descargarRecibo(ventaId: number): void {
    const reciboUrl = `http://localhost:8095/venta/${ventaId}/recibo`;
    this.http.get(reciboUrl, { responseType: 'blob' })
      .subscribe(
        (response: Blob) => {
          const url = window.URL.createObjectURL(response);
          const link = document.createElement('a');
          link.href = url;
          link.download = `recibo_venta_${ventaId}.pdf`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        (error) => {
          console.error('Error al descargar el recibo:', error);
        }
      );
  }
}
interface CartItem {
  id: number;
  userId: number;
  libroId: number;
  cantidad: number;
  image?: string;
  title?: string;
  price?: number;
  description?: string;
}
