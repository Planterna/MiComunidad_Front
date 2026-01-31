import { Component, input, output } from '@angular/core';
import { dataInformation } from '../../../models/tarjetas-config.model';


@Component({
  selector: 'app-modals-alert',
  imports: [],
  templateUrl: './modals-alert.html',
})
export class ModalsAlert {
  modalId = input.required<string>();
  titulo = input<string>('Confirmar Acción');
  data = input<dataInformation | null>();

  // Evento que se dispara cuando el usuario acepta
  confirmar = output<void>();
}
