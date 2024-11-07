import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { BooksComponent } from './recursos/books/books.component';
import { SidebarComponent } from './gestion/sidebar/sidebar.component';
import { CrudlibroComponent } from './gestion/libros/crudlibro/crudlibro.component';
import { CrudcategoriasComponent } from './gestion/libros/crudcategorias/crudcategorias.component';
import { CrudprovedoresComponent } from './gestion/libros/crudprovedores/crudprovedores.component';
import { ClientesComponent } from './gestion/cliente/clientes/clientes.component';
import { VendedoresComponent } from './gestion/cliente/vendedores/vendedores.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './auth.guard';
import { InicioComponent } from './recursos/inicio/inicio.component';
import { VentasComponent } from './gestion/libros/ventas/ventas.component';
import { UsuariosComponent } from './gestion/usuarios/usuarios.component';
import { PrecompraComponent } from './recursos/precompra/precompra.component';

export const routes: Routes = [
  { path: '', component: BooksComponent },
  { path: 'login', component: LoginComponent, canActivate: [authGuard]},
  { path: 'registro', component: RegisterComponent, canActivate: [authGuard]},
  { path: 'inicio', component: InicioComponent },
  { path: 'precompra', component: PrecompraComponent },
  {
    path: '',
    component: SidebarComponent,
    children: [
      { path: 'libros', component: CrudlibroComponent },
      { path: 'categorias', component: CrudcategoriasComponent },
      { path: 'provedores', component: CrudprovedoresComponent },
      { path: 'ventas', component: VentasComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'clientes', component: ClientesComponent },
      { path: 'vendedores', component: VendedoresComponent },
      { path: '**', redirectTo: 'inicio' }
    ]
  }
];
