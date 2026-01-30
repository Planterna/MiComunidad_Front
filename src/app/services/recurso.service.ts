import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { RecursoResponse } from '../models/recurso.model';

const url = environment.baseUrl;
@Injectable({
  providedIn: 'root',
})
export class RecursoService {
  http = inject(HttpClient);

  getRecurso(): Observable<RecursoResponse[]>{
    return this.http.get<RecursoResponse[]>(`${url}/Recursos`);
  }

  getNombreRecursoPorId(id: number): Observable<string> {
    return this.http
      .get<RecursoResponse>(`${url}/Recursos/${id}`)
      .pipe(map((recurso) => `${recurso.nombre}`));
  }
}
