// app/services/historial-uso.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { HistorialUsoResponse } from '../models/historial-uso.model';
import { map, switchMap, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HistorialUsoService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.baseUrl}/HistorialUsos`;

  getAll(): Observable<HistorialUsoResponse[]> {
    return this.http.get<HistorialUsoResponse[]>(this.baseUrl);
  }

  getById(id: number): Observable<HistorialUsoResponse> {
    return this.http.get<HistorialUsoResponse>(`${this.baseUrl}/${id}`);
  }

  create(data: HistorialUsoResponse): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  update(data: HistorialUsoResponse): Observable<any> {
    return this.http.put(`${this.baseUrl}/${data.id}`, data);
  }

  deleteSoft(id: number): Observable<any> {
    return this.getById(id).pipe(
      map((h) => ({
        ...h,
        activo: false,
        fechaModificacion: new Date().toISOString(),
      })),
      switchMap((body) => this.http.put(`${this.baseUrl}/${id}`, body)),
    );
  }

  activate(id: number): Observable<any> {
    return this.getById(id).pipe(
      map((h) => ({
        ...h,
        activo: true,
        fechaModificacion: new Date().toISOString(),
      })),
      switchMap((body) => this.http.put(`${this.baseUrl}/${id}`, body)),
    );
  }
}
