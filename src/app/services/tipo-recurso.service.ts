import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const url = environment.baseUrl;

export interface TipoRecursoResponse {
  id: number;
  nombre: string;
  fechaCreacion?: string;
  fechaModificacion?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TipoRecursoService {
  http = inject(HttpClient);

  // Obtener todos los tipos de recurso
  getTipoRecursos(): Observable<TipoRecursoResponse[]> {
    return this.http.get<TipoRecursoResponse[]>(`${url}/TipoRecursoes`);
  }

  // Obtener tipo de recurso por ID
  getTipoRecursoPorId(id: number): Observable<TipoRecursoResponse> {
    return this.http.get<TipoRecursoResponse>(`${url}/TipoRecursoes/${id}`);
  }
}