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

  // Obtener recursos con información completa (simulando endpoint Full)
  getRecursosDataFull(): Observable<any[]> {
    // Combinar recursos con tipos en una sola operación
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

  // Obtener todos los recursos (método original)
  getRecurso(): Observable<RecursoResponse[]>{
    return this.http.get<RecursoResponse[]>(`${url}/Recursos`);
  }

  // Obtener recurso por ID
  getRecursoPorId(id: number): Observable<RecursoResponse> {
    return this.http.get<RecursoResponse>(`${url}/Recursos/${id}`);
  }

  // Obtener solo el nombre del recurso por ID
  getNombreRecursoPorId(id: number): Observable<string> {
    return this.http
      .get<RecursoResponse>(`${url}/Recursos/${id}`)
      .pipe(map((recurso) => `${recurso.nombre}`));
  }

  // Crear nuevo recurso
  crearRecurso(recurso: any): Observable<RecursoResponse> {
    // Estructura basada en el esquema de Swagger, pero solo campos necesarios
    const recursoParaCrear = {
      tipoRecursoId: recurso.tipoRecursoId,
      nombre: recurso.nombre,
      capacidad: recurso.capacidad || 0,  // Swagger muestra que espera número, no null
      stock: recurso.stock || 0,          // Swagger muestra que espera número, no null
      ubicacion: recurso.ubicacion || "", // Swagger muestra que espera string, no null
      imagenUrl: recurso.imagenUrl || "", // Swagger muestra que espera string, no null
      estado: recurso.estado || "Disponible"
      // NO incluir: id, fechaCreacion, fechaModificacion, historialUsos, reservas, tipoRecurso
    };
    
    console.log('🚀 ENVIANDO SEGÚN SWAGGER:', JSON.stringify(recursoParaCrear, null, 2));
    console.log('🌐 URL:', `${url}/Recursos`);
    
    return this.http.post<RecursoResponse>(`${url}/Recursos`, recursoParaCrear);
  }

  // Actualizar recurso existente
  actualizarRecurso(recurso: any): Observable<void> {
    console.log('Servicio - Actualizando recurso:', recurso);
    console.log('URL:', `${url}/Recursos/${recurso.id}`);
    return this.http.put<void>(`${url}/Recursos/${recurso.id}`, recurso);
  }

  // Eliminar recurso
  eliminarRecurso(id: number): Observable<void> {
    return this.http.delete<void>(`${url}/Recursos/${id}`);
  }

  // Buscar recursos por nombre (optimizado)
  buscarRecursosPorNombre(nombre: string): Observable<any[]> {
    return this.getRecursosDataFull().pipe(
      map(recursos => recursos.filter(r => 
        r.nombre.toLowerCase().includes(nombre.toLowerCase())
      ))
    );
  }

  // Filtrar recursos por estado (optimizado)
  filtrarRecursosPorEstado(estado: string): Observable<any[]> {
    return this.getRecursosDataFull().pipe(
      map(recursos => recursos.filter(r => r.estado === estado))
    );
  }

  // Eliminar recurso (eliminación lógica)
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

  // Activar recurso
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
