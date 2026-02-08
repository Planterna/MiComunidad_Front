import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { dataInformation } from '../../../../models/tarjetas-config.model';
import { HistorialUsoService } from '../../../../services/historial-uso.service';
import { HistorialUsoResponse } from '../../../../models/historial-uso.model';

import { ModalsAlert } from '../../../shared/modals-alert/modals-alert';
import { AuthService } from '../../../../services/auth.service';
import { Roles } from '../../../../models/usuario.model';

@Component({
  selector: 'app-historial-uso-data',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, ModalsAlert],
  templateUrl: './historial-uso-data.html',
})
export class HistorialUsoData implements OnInit {
  private service = inject(HistorialUsoService);
  private auth = inject(AuthService);

  historial = signal<HistorialUsoResponse[]>([]);

  rolUser = signal<Roles | null>(null);
  idUser = signal<number | null>(null);

  modalId = signal<string>('modal-historial-uso');
  modalTipo = signal<dataInformation | null>(null);
  modalTitulo = signal<string>('Confirmar Acción');

  private pendingAction: (() => void) | null = null;

  baseFormulario = computed(() => {
    const rol = this.rolUser();
    return rol === 'Administrador' || rol === 'Encargado'
      ? '/admin/historial/formulario'
      : '/historial-uso/formulario';
  });

  textoBusqueda = signal<string>('');
  filtroDevuelto = signal<boolean>(false);
  filtroDaniado = signal<boolean>(false);
  filtroRetrasado = signal<boolean>(false);

  historialFiltrado = computed(() => {
    let data = this.historial();

    const texto = this.textoBusqueda().toLowerCase().trim();
    if (texto) {
      data = data.filter((item) =>
        (item.estado ?? '').toLowerCase().includes(texto) ||
        (item.notas ?? '').toLowerCase().includes(texto) ||
        `${item.usuario?.nombres ?? ''} ${item.usuario?.apellidos ?? ''}`
          .toLowerCase()
          .includes(texto) ||
        (item.recurso?.nombre ?? '').toLowerCase().includes(texto)
      );
    }

    const filtrosActivos: string[] = [];
    if (this.filtroDevuelto()) filtrosActivos.push('Devuelto');
    if (this.filtroDaniado()) filtrosActivos.push('Dañado');
    if (this.filtroRetrasado()) filtrosActivos.push('Retrasado');

    if (filtrosActivos.length > 0) {
      data = data.filter((item) => filtrosActivos.includes(item.estado as any));
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

    this.service.getAll().subscribe((data) => {
      // Administrador y Encargado ven todo
      if (rol === 'Administrador' || rol === 'Encargado') {
        this.historial.set(data);
        return;
      }

      // Vecino solo ve lo suyo
      if (rol === 'Vecino' && id != null) {
        this.historial.set(data.filter((x) => x.usuarioId === id));
        return;
      }

      this.historial.set([]);
    });
  }

  aplicarFiltros(): void {}

  limpiarFiltros(): void {
    this.textoBusqueda.set('');
    this.filtroDevuelto.set(false);
    this.filtroDaniado.set(false);
    this.filtroRetrasado.set(false);
  }

  // ===== ROLES =====
  esAdminOEncargado(): boolean {
    const rol = this.rolUser();
    return rol === 'Administrador' || rol === 'Encargado';
  }

  esVecino(): boolean {
    return this.rolUser() === 'Vecino';
  }

  // ===== MODAL =====
  abrirModal(tipo: dataInformation, titulo: string, action?: () => void) {
    this.modalTipo.set(tipo);
    this.modalTitulo.set(titulo);
    this.pendingAction = action ?? null;

    const el = document.getElementById(this.modalId()) as HTMLInputElement | null;
    if (el) el.checked = true;
  }

  private cerrarModal() {
    const el = document.getElementById(this.modalId()) as HTMLInputElement | null;
    if (el) el.checked = false;
  }

  confirmarAccion() {
    const fn = this.pendingAction;
    this.pendingAction = null;
    this.cerrarModal();
    if (fn) fn();
  }

  private mostrarResultado(ok: boolean, tituloOk: string, tituloError: string) {
    this.abrirModal(ok ? 'success' : 'error', ok ? tituloOk : tituloError);
  }

  // ===== ACCIONES ADMIN =====
  private desactivar(id: number): void {
    if (!this.esAdminOEncargado()) return;

    this.abrirModal('confirm', 'Desactivar registro', () => {
      this.service.deleteSoft(id).subscribe({
        next: () => {
          this.mostrarResultado(true, 'Registro desactivado correctamente', 'No se pudo desactivar');
          this.cargar();
        },
        error: () => this.mostrarResultado(false, 'Ok', 'No se pudo desactivar'),
      });
    });
  }

  private activar(id: number): void {
    if (!this.esAdminOEncargado()) return;

    this.abrirModal('confirm', 'Activar registro', () => {
      this.service.activate(id).subscribe({
        next: () => {
          this.mostrarResultado(true, 'Registro activado correctamente', 'No se pudo activar');
          this.cargar();
        },
        error: () => this.mostrarResultado(false, 'Ok', 'No se pudo activar'),
      });
    });
  }

  // ===== Botones del template =====
  // NUEVO: Admin navega, Vecino muestra modal "No acceso"
  pedirNuevo(event?: Event): void {
    if (this.esAdminOEncargado()) return;

    event?.preventDefault();   // BLOQUEA el routerLink
    event?.stopPropagation();  // Extra seguridad

    this.abrirModal('error', 'No tienes acceso a esta función');
  }

  pedirDesactivar(id?: number): void {
    if (id == null) return;

    if (!this.esAdminOEncargado()) {
      this.abrirModal('error', 'No tienes acceso a esta función');
      return;
    }

    this.desactivar(id);
  }

  pedirActivar(id?: number): void {
    if (id == null) return;

    if (!this.esAdminOEncargado()) {
      this.abrirModal('error', 'No tienes acceso a esta función');
      return;
    }

    this.activar(id);
  }
}
