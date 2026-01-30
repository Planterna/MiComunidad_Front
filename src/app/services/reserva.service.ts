import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { ReservaFullResponse, ReservaResponse } from '../models/reserva.model';
import { Observable } from 'rxjs';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class ReservaService {
  http = inject(HttpClient);

  getReservas(): Observable<ReservaResponse[]> {
    return this.http.get<ReservaResponse[]>(`${baseUrl}/Reservas`);
  }

  getReservasForId(id: number): Observable<ReservaResponse> {
    return this.http.get<ReservaResponse>(`${baseUrl}/Reservas/${id}`);
  }

  getReservasDataFull(): Observable<ReservaFullResponse[]> {
    return this.http.get<ReservaFullResponse[]>(`${baseUrl}/Reservas/Full`);
  }

  createReserva(reserva: ReservaResponse): Observable<ReservaResponse> {
    return this.http.post<ReservaResponse>(baseUrl, reserva);
  }

  updateReserva(reserva: ReservaResponse): Observable<ReservaResponse> {
    console.log({ reserva });
    const urlReservasEditar = `${baseUrl}/Reservas/${reserva.id}`;
    return this.http.put<ReservaResponse>(urlReservasEditar, reserva);
  }
}
