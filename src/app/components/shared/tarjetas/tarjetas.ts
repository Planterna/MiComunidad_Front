import { Component, input, output } from '@angular/core';
import { ReservaResponse } from '../../../models/reserva.model';
import { tarjetasConfig } from '../../../models/tarjetas-config.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tarjetas',
  imports: [RouterLink],
  templateUrl: './tarjetas.html',
})
export class Tarjetas {
  data = input.required<any[]>();
  configCard = input.required<tarjetasConfig>();
  dataEstado = input<boolean>();

  buscar = output<any>();
  filtrar = output<any>();
  eliminar = output<any>();
}
