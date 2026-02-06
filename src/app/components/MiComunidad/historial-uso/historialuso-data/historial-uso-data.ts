import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { HistorialUsoService } from '../../../../services/historial-uso.service';
import { HistorialUsoResponse } from '../../../../models/historial-uso.model';

@Component({
  selector: 'app-historial-uso-data',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DatePipe
  ],
  templateUrl: './historial-uso-data.html',
})
export class HistorialUsoData implements OnInit {

  private service = inject(HistorialUsoService);


  //  DATA PRINCIPAL
  historial = signal<HistorialUsoResponse[]>([]);

  //  BUSCADOR
  textoBusqueda = signal<string>('');

  //  FILTROS
  filtroDevuelto = signal<boolean>(false);
  filtroDaniado = signal<boolean>(false);
  filtroRetrasado = signal<boolean>(false);

  //  FILTRADO FINAL
  historialFiltrado = computed(() => {
    let data = this.historial();

    // Buscar por texto
    const texto = this.textoBusqueda().toLowerCase();
    if (texto) {
      data = data.filter(item =>
        item.estado?.toLowerCase().includes(texto) ||
        item.notas?.toLowerCase().includes(texto) ||
        `${item.usuario?.nombres} ${item.usuario?.apellidos}`.toLowerCase().includes(texto)
      );
    }

    // Filtros por estado
    const filtrosActivos: string[] = [];
    if (this.filtroDevuelto()) filtrosActivos.push('Devuelto');
    if (this.filtroDaniado()) filtrosActivos.push('Dañado');
    if (this.filtroRetrasado()) filtrosActivos.push('Retrasado');

    if (filtrosActivos.length > 0) {
      data = data.filter(item => filtrosActivos.includes(item.estado));
    }

    return data;
  });

  //  CICLO DE VIDA

ngOnInit(): void {
  this.service.getAll().subscribe(
    (data: HistorialUsoResponse[]) => {
      this.historial.set(data);
    }
  );
}

  //  CARGAR DATA
  cargar(): void {
    this.service.getAll().subscribe(data => {
      this.historial.set(data);
    });
  }

  //  REAPLICAR FILTROS
  aplicarFiltros(): void {
    // No hace nada aquí porque computed se recalcula solo
  }

  //  LIMPIAR FILTROS
  limpiarFiltros(): void {
    this.textoBusqueda.set('');
    this.filtroDevuelto.set(false);
    this.filtroDaniado.set(false);
    this.filtroRetrasado.set(false);
  }

  //  ELIMINAR
  eliminar(id: number): void {
    if (!confirm('¿Deseas eliminar este registro?')) return;

    this.service.delete(id).subscribe(() => {
      this.cargar();
    });
  }
}
