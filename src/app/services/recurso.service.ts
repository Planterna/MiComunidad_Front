import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';
import { RecursoResponse } from '../models/recurso.model';

const url = environment.baseUrl;
@Injectable({
  providedIn: 'root',
})
export class RecursoService {
  http = inject(HttpClient);

  getRecursosDataFull(): Observable<any[]> {
    return this.http.get<RecursoResponse[]>(`${url}/Recursos`).pipe(
      switchMap(recursos => 
        this.http.get<any[]>(`${url}/TipoRecursoes`).pipe(
          map(tipos => 
            recursos.map(recurso => ({
              ...recurso,
              tipoRecursoNombre: tipos.find(t => t.id === recurso.tipoRecursoId)?.nombre || 'Sin tipo',
              tipoRecursoCompleto: tipos.find(t => t.id === recurso.tipoRecursoId),
              activo: recurso.estado === 'Disponible'
            }))
          )
        )
      )
    );
  }

  getRecurso(): Observable<RecursoResponse[]>{
    return this.http.get<RecursoResponse[]>(`${url}/Recursos`);
  }

  getRecursoPorId(id: number): Observable<RecursoResponse> {
    return this.http.get<RecursoResponse>(`${url}/Recursos/${id}`);
  }

  getNombreRecursoPorId(id: number): Observable<string> {
    return this.http
      .get<RecursoResponse>(`${url}/Recursos/${id}`)
      .pipe(map((recurso) => `${recurso.nombre}`));
  }

  crearRecurso(recurso: any): Observable<RecursoResponse> {
    const recursoParaCrear = {
      tipoRecursoId: recurso.tipoRecursoId,
      nombre: recurso.nombre,
      capacidad: recurso.capacidad || 0,
      stock: recurso.stock || 0,
      ubicacion: recurso.ubicacion || "",
      imagenUrl: recurso.imagenUrl || "",
      estado: recurso.estado || "Disponible"
    };
    
    return this.http.post<RecursoResponse>(`${url}/Recursos`, recursoParaCrear);
  }

  actualizarRecurso(recurso: any): Observable<void> {
    return this.http.put<void>(`${url}/Recursos/${recurso.id}`, recurso);
  }

  eliminarRecurso(id: number): Observable<void> {
    return this.http.delete<void>(`${url}/Recursos/${id}`);
  }

  buscarRecursosPorNombre(nombre: string): Observable<any[]> {
    return this.getRecursosDataFull().pipe(
      map(recursos => recursos.filter(r => 
        r.nombre.toLowerCase().includes(nombre.toLowerCase())
      ))
    );
  }

  filtrarRecursosPorEstado(estado: string): Observable<any[]> {
    return this.getRecursosDataFull().pipe(
      map(recursos => recursos.filter(r => r.estado === estado))
    );
  }

  eliminarRecursoLogico(id: number): Observable<any> {
    return this.getRecursoPorId(id).pipe(
      switchMap(recurso => 
        this.http.get<any[]>(`${url}/TipoRecursoes`).pipe(
          map(tipos => tipos.find(t => t.id === recurso.tipoRecursoId)),
          switchMap(tipoRecurso => {
            const recursoActualizado = {
              ...recurso,
              tipoRecurso: tipoRecurso,
              estado: 'Mantenimiento',
              fechaModificacion: new Date().toISOString()
            };
            return this.http.put(`${url}/Recursos/${id}`, recursoActualizado);
          })
        )
      )
    );
  }

  activarRecurso(id: number): Observable<any> {
    return this.getRecursoPorId(id).pipe(
      switchMap(recurso => 
        this.http.get<any[]>(`${url}/TipoRecursoes`).pipe(
          map(tipos => tipos.find(t => t.id === recurso.tipoRecursoId)),
          switchMap(tipoRecurso => {
            const recursoActualizado = {
              ...recurso,
              tipoRecurso: tipoRecurso,
              estado: 'Disponible',
              fechaModificacion: new Date().toISOString()
            };
            return this.http.put(`${url}/Recursos/${id}`, recursoActualizado);
          })
        )
      )
    );
  }
}
