import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { HistorialUsoResponse } from '../models/historial-uso.model';

@Injectable({ providedIn: 'root' })
export class HistorialUsoService {

  private http = inject(HttpClient);
  private baseUrl = `${environment.baseUrl}/HistorialUsos`;

  getAll() {
    return this.http.get<HistorialUsoResponse[]>(this.baseUrl);
  }

  getById(id: number) {
    return this.http.get<HistorialUsoResponse>(`${this.baseUrl}/${id}`);
  }

  create(data: any) {
    return this.http.post(this.baseUrl, data); // POST sin ID
  }

  update(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/${id}`, data); // PUT con ID
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}

