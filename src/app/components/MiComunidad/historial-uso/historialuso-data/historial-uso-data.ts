import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { HistorialUsoService } from '../../../../services/historial-uso.service';
import { HistorialUsoResponse } from '../../../../models/historial-uso.model';
import { AuthService } from '../../../../services/auth.service';
import { Roles } from '../../../../models/usuario.model';
import { ModalsAlert } from '../../../shared/modals-alert/modals-alert';
import { dataInformation } from '../../../../models/tarjetas-config.model';

@Component({
  selector: 'app-historial-uso-data',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, ModalsAlert],
  templateUrl: './historial-uso-data.html',
})
export class HistorialUsoData implements OnInit {

  private service = inject(HistorialUsoService);
  private auth = inject(AuthService);
  private router = inject(Router);

  historial = signal<HistorialUsoResponse[]>([]);

  rolUser = signal<Roles | null>(null);
  idUser = signal<number | null>(null);

  modalId = signal('modal-historial-uso');
  modalTipo = signal<dataInformation | null>(null);
  modalTitulo = signal('Confirmar Acción');

  private pendingAction: (() => void) | null = null;

  baseFormulario = computed(() => '/admin/historial/formulario');

  textoBusqueda = signal('');
  filtroDevuelto = signal(false);
  filtroDaniado = signal(false);
  filtroRetrasado = signal(false);

  historialFiltrado = computed(() => {
    let data = this.historial();

    const texto = this.textoBusqueda().toLowerCase().trim();
    if (texto) {
      data = data.filter(x =>
        (x.estado ?? '').toLowerCase().includes(texto) ||
        (x.notas ?? '').toLowerCase().includes(texto) ||
        `${x.usuario?.nombres ?? ''} ${x.usuario?.apellidos ?? ''}`.toLowerCase().includes(texto) ||
        (x.recurso?.nombre ?? '').toLowerCase().includes(texto)
      );
    }

    const estados: string[] = [];
    if (this.filtroDevuelto()) estados.push('Devuelto');
    if (this.filtroDaniado()) estados.push('Dañado');
    if (this.filtroRetrasado()) estados.push('Retrasado');

    if (estados.length > 0) {
      data = data.filter(x => estados.includes(x.estado));
    }

    return data;
  });

  ngOnInit(): void {
    this.rolUser.set(this.auth.getRole());
    this.idUser.set(this.auth.getId());
    this.cargar();
  }

  cargar(): void {
    const rol = this.rolUser();
    const id = this.idUser();

    this.service.getAll().subscribe(data => {
      if (rol === 'Administrador' || rol === 'Encargado') {
        this.historial.set(data);
        return;
      }

      if (rol === 'Vecino' && id != null) {
        this.historial.set(data.filter(x => x.usuarioId === id));
        return;
      }

      this.historial.set([]);
    });
  }

  limpiarFiltros(): void {
    this.textoBusqueda.set('');
    this.filtroDevuelto.set(false);
    this.filtroDaniado.set(false);
    this.filtroRetrasado.set(false);
  }

  esAdminOEncargado(): boolean {
    return this.rolUser() === 'Administrador' || this.rolUser() === 'Encargado';
  }

  abrirModal(tipo: dataInformation, titulo: string, action?: () => void) {
    this.modalTipo.set(tipo);
    this.modalTitulo.set(titulo);
    this.pendingAction = action ?? null;

    const el = document.getElementById(this.modalId()) as HTMLInputElement | null;
    if (el) el.checked = true;
  }

  confirmarAccion() {
    const fn = this.pendingAction;
    this.pendingAction = null;

    const el = document.getElementById(this.modalId()) as HTMLInputElement | null;
    if (el) el.checked = false;

    if (fn) fn();
  }

  pedirDesactivar(id?: number): void {
    if (id == null) return;
    this.abrirModal('confirm', 'Desactivar registro', () => {
      this.service.deleteSoft(id).subscribe(() => this.cargar());
    });
  }

  pedirActivar(id?: number): void {
    if (id == null) return;
    this.abrirModal('confirm', 'Activar registro', () => {
      this.service.activate(id).subscribe(() => this.cargar());
    });
  }
}
