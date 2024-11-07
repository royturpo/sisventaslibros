import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-crudlibro',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './crudlibro.component.html',
  styleUrl: './crudlibro.component.css'
})
export class CrudlibroComponent implements OnInit{
  libros: any[] = [];
  categorias: any[] = [];
  provedores: any[] = [];
  isModalOpen: boolean = false;
  modalTitle: string = '';
  selectedLibro: any = {
    id: null,
    titulo: '',
    autor: '',
    stock: '',
    precio: '',
    categoriaId: '',
    provedoresId: '',
    anio: '',
    imagen: null
  };
  libroForm: FormGroup;
  selectedFile: File | null = null;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.libroForm = this.fb.group({
      titulo: ['', Validators.required],
      autor: ['', Validators.required],
      stock: ['', Validators.required],
      precio: ['', Validators.required],
      categoriaId: ['', Validators.required],
      provedoresId: ['', Validators.required],
      anio: ['', Validators.required],
      imagen: [null]
    });
  }

  ngOnInit() {
    this.loadLibros();
    this.loadCategorias();
    this.loadProvedores();
  }

  loadLibros() {
    this.http.get('http://localhost:8095/libros').subscribe((data: any) => {
      this.libros = data;
    });
  }

  loadCategorias() {
    this.http.get('http://localhost:8095/categoria').subscribe((data: any) => {
      this.categorias = data;
    });
  }

  loadProvedores() {
    this.http.get('http://localhost:8095/provedores').subscribe((data: any) => {
      this.provedores = data;
    });
  }

  openModal(mode: string, libro?: any) {
    this.isModalOpen = true;
    this.modalTitle = mode === 'create' ? 'Agregar Libro' : 'Editar Libro';
    if (mode === 'edit' && libro) {
      this.selectedLibro = { ...libro };
      this.libroForm.patchValue(this.selectedLibro);
    } else {
      this.selectedLibro = {
        id: null,
        titulo: '',
        autor: '',
        stock: '',
        precio: '',
        categoriaId: '',
        provedoresId: '',
        anio: '',
        imagen: null
      };
      this.libroForm.reset();
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  saveLibro() {
    const formData = new FormData();
    Object.keys(this.libroForm.value).forEach(key => {
      formData.append(key, this.libroForm.value[key]);
    });
    if (this.selectedFile) {
      formData.append('imagen', this.selectedFile, this.selectedFile.name);
    }

    if (this.selectedLibro.id) {
      this.http.put(`http://localhost:8095/libros/${this.selectedLibro.id}`, formData).subscribe(() => {
        this.loadLibros();
        this.closeModal();
      });
    } else {
      this.http.post('http://localhost:8095/libros', formData).subscribe(() => {
        this.loadLibros();
        this.closeModal();
      });
    }
  }

  deleteLibro(id: number) {
    this.http.delete(`http://localhost:8095/libros/${id}`).subscribe(() => {
      this.loadLibros();
    });
  }

  getImageUrl(imagePath?: string): string {
    return imagePath ? `http://localhost:8095/libros/uploads/${imagePath}` : 'ruta/por/defecto/imagen.png';
  }
}
