import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { dataInformation } from '../../../models/tarjetas-config.model';

@Component({
  selector: 'app-modals-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modals-alert.html',
})
export class ModalsAlert {
  modalId = input.required<string>();
  titulo = input<string>('Confirmar Acción');
  data = input<dataInformation | null>();

  confirmar = output<void>();
}
