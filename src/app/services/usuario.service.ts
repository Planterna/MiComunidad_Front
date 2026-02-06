import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { map, Observable, pipe } from 'rxjs';
import { UsuarioResponse } from '../models/usuario.model';

const url = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  http = inject(HttpClient);

private baseUrl = `${environment.baseUrl}/Usuarios`;

getUsuarios(): Observable<any[]> {
  return this.http.get<any[]>(this.baseUrl);
}

  getNombreUsuarioPorId(id: number): Observable<string> {
  return this.http
    .get<UsuarioResponse>(`${url}/Usuarios/${id}`)
    .pipe(
      map(user => `${user.nombres} ${user.apellidos}`)
    );
  }


  getNombreUsuarioCompleto(): Observable<UsuarioResponse[]> {
    return this.http.get<UsuarioResponse[]>(`${url}/Usuarios`);
  }

  getUsuarioPorId(id: number) {
  return this.http.get<UsuarioResponse>(`${url}/Usuarios/${id}`);
}

actualizarUsuario(usuario: UsuarioResponse) {
    console.log('Actualizando usuario:', usuario);
    return this.http.put(`${url}/Usuarios/${usuario.id}`, usuario);
    
  }

}
      