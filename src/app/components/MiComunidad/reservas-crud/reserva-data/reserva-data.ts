import { Component, inject, OnInit, signal } from '@angular/core';
import { Tarjetas } from '../../../shared/tarjetas/tarjetas';
import { ReservaService } from '../../../../services/reserva.service';
import { ReservaResponse } from '../../../../models/reserva.model';
import { tarjetasConfig } from '../../../../models/tarjetas-config.model';

@Component({
  selector: 'app-reserva-data',
  imports: [Tarjetas],
  templateUrl: './reserva-data.html',
})
export class ReservaData implements OnInit {
  //! DI
  reservaServicio = inject(ReservaService);

  //! Config
  confReserva: tarjetasConfig = {
    id: 'id',
    titulo: 'nombreRecurso',
    subtitulo: 'fecha',
    horaInicio: 'horaInicio',
    horaFin: 'horaFin',
    descripcion: 'motivo',
    imagenUrl: 'imagenUrl',
    estado: 'estado',
    status: 'activo',
  };

  //! Data
  reservas = signal<ReservaResponse[]>([]);

  ngOnInit(): void {
    this.cargarData();
  }

  cargarData() {
    this.reservaServicio.getReservasDataFull().subscribe((data) => this.reservas.set(data));
  }

  eliminarData(id: number) {
    this.reservaServicio.deleteReserva(id).subscribe(() => {
      console.log('eliminado');
      this.cargarData();
    });
  }

  buscarDato(event: any) {
    const texto = event.target.value.toLowerCase().trim();

    if (texto === '') {
      this.cargarData();
      return;
    }

    this.reservaServicio.buscarReservasPorMotivo(texto).subscribe((res) => {
      this.reservas.set(res);
    });
  }

  FiltarDato(event: any) {
    const texto = event.target.value.trim();

    if (texto === '') {
      this.cargarData();
      return;
    }
    this.reservaServicio.filtarReservaPorEstado(texto).subscribe((res) => {
      this.reservas.set(res);
    });
  }
}
