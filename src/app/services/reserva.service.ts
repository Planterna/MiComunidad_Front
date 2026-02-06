import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { ReservaFullResponse, ReservaResponse, Estado } from '../models/reserva.model';
import { map, Observable, switchMap } from 'rxjs';

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

  getReservasDataFullForId(id: number): Observable<ReservaFullResponse[]> {
    return this.http
      .get<ReservaFullResponse[]>(`${baseUrl}/Reservas/Full`)
      .pipe(map((res) => res.filter((r) => r.usuarioId === id)));
  }

  createReserva(reserva: ReservaResponse): Observable<ReservaResponse> {
    return this.http.post<ReservaResponse>(`${baseUrl}/Reservas`, reserva);
  }

  deleteReserva(id: number): Observable<ReservaResponse> {
    return this.getReservasForId(id).pipe(
      map((reserva) => ({
        ...reserva,
        activo: false,
        fechaModificacion: new Date().toISOString(),
      })),
      switchMap((body) => this.http.put<ReservaResponse>(`${baseUrl}/Reservas/${id}`, body)),
    );
  }

  activedReserva(id: number): Observable<ReservaResponse> {
    return this.getReservasForId(id).pipe(
      map((reserva) => ({
        ...reserva,
        activo: true,
        fechaModificacion: new Date().toISOString(),
      })),
      switchMap((body) => this.http.put<ReservaResponse>(`${baseUrl}/Reservas/${id}`, body)),
    );
  }

  updateReserva(reserva: ReservaResponse): Observable<ReservaResponse> {
    const urlReservasEditar = `${baseUrl}/Reservas/${reserva.id}`;
    return this.http.put<ReservaResponse>(urlReservasEditar, reserva);
  }

  buscarReservasPorMotivo(param: string): Observable<ReservaFullResponse[]> {
    return this.http
      .get<ReservaFullResponse[]>(`${baseUrl}/Reservas/Full`)
      .pipe(
        map((reservas) =>
          reservas.filter(
            (r) =>
              r.motivo?.toLowerCase().includes(param.toLowerCase()) ||
              r.nombreRecurso?.toLowerCase().includes(param.toLowerCase()),
          ),
        ),
      );
  }

  buscarReservasPorMotivoPorId(param: string, id: number): Observable<ReservaFullResponse[]> {
    return this.http
      .get<ReservaFullResponse[]>(`${baseUrl}/Reservas/Full`)
      .pipe(
        map((reservas) =>
          reservas.filter(
            (r) =>
              (r.motivo?.toLowerCase().includes(param.toLowerCase()) ||
                r.nombreRecurso?.toLowerCase().includes(param.toLowerCase())) &&
              r.usuarioId === id,
          ),
        ),
      );
  }

  filtarReservaPorEstado(param: string): Observable<ReservaFullResponse[]> {
    return this.http
      .get<ReservaFullResponse[]>(`${baseUrl}/Reservas/Full`)
      .pipe(
        map((reservas) =>
          reservas.filter((r) => r.estado?.toLowerCase().includes(param.toLowerCase())),
        ),
      );
  }

  filtarReservaPorEstadoPorId(param: string, id: number): Observable<ReservaFullResponse[]> {
    return this.http
      .get<ReservaFullResponse[]>(`${baseUrl}/Reservas/Full`)
      .pipe(
        map((reservas) =>
          reservas.filter(
            (r) => r.estado?.toLowerCase().includes(param.toLowerCase()) && r.usuarioId === id,
          ),
        ),
      );
  }
}
