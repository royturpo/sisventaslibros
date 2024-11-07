import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crudprovedores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crudprovedores.component.html',
  styleUrl: './crudprovedores.component.css'
})
export class CrudprovedoresComponent {
  provedores: any[] = [];
  isModalOpen: boolean = false;
  modalTitle: string = '';
  selectedProveedor: any = {
    id: null,
    nombre: '',
    entrega: '',
    tipo: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadProvedores();
  }

  loadProvedores() {
    this.http.get('http://localhost:8095/provedores').subscribe((data: any) => {
      this.provedores = data;
    });
  }

  openModal(mode: string, proveedor?: any) {
    this.isModalOpen = true;
    this.modalTitle = mode === 'create' ? 'Agregar Proveedor' : 'Editar Proveedor';
    if (mode === 'edit' && proveedor) {
      this.selectedProveedor = { ...proveedor };
      this.selectedProveedor.entrega = new Date(this.selectedProveedor.entrega).toISOString().split('T')[0]; // Convert date to YYYY-MM-DD format
    } else {
      this.selectedProveedor = {
        id: null,
        nombre: '',
        entrega: '',
        tipo: ''
      };
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveProveedor() {
    if (this.selectedProveedor.id) {
      this.http.post(`http://localhost:8095/provedores/${this.selectedProveedor.id}`, this.selectedProveedor).subscribe(() => {
        this.loadProvedores();
        this.closeModal();
      });
    } else {
      this.http.post('http://localhost:8095/provedores', this.selectedProveedor).subscribe(() => {
        this.loadProvedores();
        this.closeModal();
      });
    }
  }

  deleteProveedor(id: number) {
    this.http.delete(`http://localhost:8095/provedores/${id}`).subscribe(() => {
      this.loadProvedores();
    });
  }
}
