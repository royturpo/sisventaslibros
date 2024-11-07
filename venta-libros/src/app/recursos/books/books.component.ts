import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Libro } from '../libro.model';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { Route } from '@angular/router';
import { NotificationService } from '../notification/notification.service';
@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent implements OnInit {
  isCartOpen = false;
  cartItems: CartItem[] = [];
  books: Libro[] = [];
  categorias: any[] = [];
  anios: number[] = [];

  constructor(private http: HttpClient, public authService: AuthService, private router: Router, private notificationService: NotificationService) {}

  ngOnInit() {
    this.loadBooks();
    this.loadCategorias();
    this.loadAnios();
    this.loadCartItems();
  }
  loadBooks() {
    this.http.get<Libro[]>('http://localhost:8095/libros')
      .subscribe(
        (data: Libro[]) => {
          this.books = data;
        },
        (error) => {
          console.error('Error al obtener los libros:', error);
        }
      );
  }

  loadCategorias() {
    this.http.get<any[]>('http://localhost:8095/categoria')
      .subscribe(
        (data: any[]) => {
          this.categorias = data;
        },
        (error) => {
          console.error('Error al obtener las categorías:', error);
        }
      );
  }

  loadAnios() {
    // Suponiendo que los años están predefinidos
    this.anios = [2010, 2011, 2012, 2013, 2014, 2015, 2017, 2018, 2019, 2020]; // Ajusta según sea necesario
  }

  filterByCategory(categoryId: number) {
    this.http.get<Libro[]>(`http://localhost:8095/libros/categoria/${categoryId}`)
      .subscribe(
        (data: Libro[]) => {
          this.books = data;
        },
        (error) => {
          console.error('Error al obtener los libros por categoría:', error);
        }
      );
  }

  filterByYear(anio: number) {
    this.http.get<Libro[]>(`http://localhost:8095/libros/anio/${anio}`)
      .subscribe(
        (data: Libro[]) => {
          this.books = data;
        },
        (error) => {
          console.error('Error al obtener los libros por año:', error);
        }
      );
  }

  getImageUrl(imagePath?: string): string {
    return imagePath ? `http://localhost:8095/libros/uploads/${imagePath}` : 'ruta/por/defecto/imagen.png';
  }
  increaseQuantity(book: Libro) {
    book.quantity = (book.quantity || 1) + 1;
  }

  decreaseQuantity(book: Libro) {
    book.quantity = (book.quantity || 1) - 1;
    if (book.quantity < 1) {
      book.quantity = 1;
    }
  }
  addToCart(book: Libro) {
    const cartItem = {
      libroId: book.id,
      cantidad: book.quantity || 1
    };

    this.http.post('http://localhost:8095/carrito/agregar', cartItem).subscribe(
      () => {
        this.notificationService.showSuccess('Libro agregado al carrito con éxito');
        this.loadCartItems();
      },
      (error) => {
        if (error.status === 401) {
          this.notificationService.showError('Debe iniciar sesión para agregar al carrito');
        } else {
          this.notificationService.showError('Error al agregar el libro al carrito');
        }
      }
    );
  }
  openCart(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadCartItems();
    this.isCartOpen = true;
  }
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  closeCart(): void {
    this.isCartOpen = false;
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
      this.http.get<Libro>(`http://localhost:8095/libros/${item.libroId}`)
        .subscribe(
          (bookDetails) => {
            item.image = bookDetails.imagenUrl;
            item.title = bookDetails.titulo;
            item.price = bookDetails.precio;
            item.description = bookDetails.autor;
          },
          (error) => {
            console.error('Error al obtener los detalles del libro:', error);
          }
        );
    });
  }

  removeFromCart(itemId: number): void {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    this.http.delete(`http://localhost:8095/carrito/eliminar/${itemId}`).subscribe(
      () => {
        this.notificationService.showSuccess('Libro eliminado del carrito con éxito');
        this.loadCartItems();
      },
      (error) => {
        this.notificationService.showError('Error al eliminar el libro del carrito');
      }
    );
  }


  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price || 0) * item.cantidad, 0);
  }
  realizarCompra(): void {
    this.router.navigate(['/precompra']);
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
