import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent {
  clientes: any[] = [];
  isModalOpen: boolean = false;
  modalTitle: string = '';
  selectedCliente: any = {
    id: null,
    nombre: '',
    dni: '',
    telefono: '',
    correo: '',
    direccion: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadClientes();
  }

  loadClientes() {
    this.http.get('http://localhost:8095/cliente').subscribe((data: any) => {
      this.clientes = data;
    });
  }

  openModal(mode: string, cliente?: any) {
    this.isModalOpen = true;
    this.modalTitle = mode === 'create' ? 'Agregar Cliente' : 'Editar Cliente';
    if (mode === 'edit' && cliente) {
      this.selectedCliente = { ...cliente };
    } else {
      this.selectedCliente = {
        id: null,
        nombre: '',
        dni: '',
        telefono: '',
        correo: '',
        direccion: ''
      };
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveCliente() {
    if (this.selectedCliente.id) {
      this.http.put(`http://localhost:8095/cliente/${this.selectedCliente.id}`, this.selectedCliente).subscribe(() => {
        this.loadClientes();
        this.closeModal();
      });
    } else {
      this.http.post('http://localhost:8095/cliente', this.selectedCliente).subscribe(() => {
        this.loadClientes();
        this.closeModal();
      });
    }
  }

  deleteCliente(id: number) {
    this.http.delete(`http://localhost:8095/cliente/${id}`).subscribe(() => {
      this.loadClientes();
    });
  }

}
