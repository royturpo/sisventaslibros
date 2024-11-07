import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {
  usuarios: any[] = [];
  clientes: any[] = [];
  vendedores: any[] = [];
  selectedUserId: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadUsuarios();
    this.loadClientes();
    this.loadVendedores();
  }

  loadUsuarios() {
    this.http.get('http://localhost:8095/usuario/listar').subscribe((data: any) => {
      this.usuarios = data;
    });
  }

  loadClientes() {
    this.http.get('http://localhost:8095/cliente').subscribe((data: any) => {
      this.clientes = data;
    });
  }

  loadVendedores() {
    this.http.get('http://localhost:8095/vendedor').subscribe((data: any) => {
      this.vendedores = data;
    });
  }

  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.http.delete(`http://localhost:8095/usuario/eliminar/${id}`).subscribe(() => {
        this.loadUsuarios();
      });
    }
  }

  assignClientOrVendor(userId: number, type: 'cliente' | 'vendedor', event: Event) {
    const entityId = (event.target as HTMLSelectElement).value;
    const url = type === 'cliente'
      ? `http://localhost:8095/usuario/vincularCliente/${userId}/${entityId}`
      : `http://localhost:8095/usuario/vincularVendedor/${userId}/${entityId}`;

    this.http.post(url, {}).subscribe(() => {
      this.loadUsuarios();
    });
  }

  openAssignModal(userId: number) {
    this.selectedUserId = userId;
    // Open modal logic here
  }
}
