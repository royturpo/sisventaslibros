import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Libro } from '../libro.model';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit{
  libros: Libro[] = [];
  private apiUrl = 'http://localhost:8095/libros';

  constructor(private http: HttpClient) {}
  ngOnInit() {
    this.getLibros().subscribe(data => {
      this.libros = data;
    });
  }

  getLibros(): Observable<Libro[]> {
    return this.http.get<Libro[]>(this.apiUrl);
  }

  getImageUrl(imagePath?: string): string {
    return imagePath ? `http://localhost:8095/libros/uploads/${imagePath}` : 'ruta/por/defecto/imagen.png';
  }
}
