export interface Libro {
  id: number;
  titulo: string;
  autor: string;
  precio: number;
  stock: number;
  imagenUrl: string;
  categoria: {
    id: number;
    nombre: string;
    clasificacion: string;
    formato: string;
    idioma: string;
  };
  anio: number;
  provedores: {
    id: number;
    nombre: string;
    entrega: string;
    tipo: string;
  };
  quantity: number;
}
