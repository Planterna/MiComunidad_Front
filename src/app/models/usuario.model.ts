
export interface UsuarioResponse {
  id?:                   number;
  cedula:               string;
  nombres:              string;
  apellidos:            string;
  email:                string;
  passHash:             string;
  telefono:             string;
  direccion:            string;
  rolId?:                number;
  estado?:               Estado;
  aceptaNotificaciones: boolean;
  fechaCreacion?:        Date;
  fechaModificacion?:    Date;
  historialUsos?:        any[];
  noticia?:              any[];
  reservas?:             any[];
  rol?:                  null;
}

export enum Estado {
  Activo = "Activo",
  Inactivo = "Inactivo",
}


export type Roles = 'Administrador' | 'Encargado' | 'Vecino' | '';