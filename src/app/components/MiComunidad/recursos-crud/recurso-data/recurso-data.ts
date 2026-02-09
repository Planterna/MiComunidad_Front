import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { RecursoService } from '../../../../services/recurso.service';
import { TipoRecursoService } from '../../../../services/tipo-recurso.service';
import { dataInformation } from '../../../../models/tarjetas-config.model';
import { ModalsAlert } from '../../../shared/modals-alert/modals-alert';
import { AuthService } from '../../../../services/auth.service';
import { Roles } from '../../../../models/usuario.model';

@Component({
  selector: 'app-recurso-data',
  standalone: true,
  imports: [RouterLink, ModalsAlert, DatePipe],
  templateUrl: './recurso-data.html',
})
export class RecursoData implements OnInit {
  recursoServicio = inject(RecursoService);
  tipoRecursoServicio = inject(TipoRecursoService);
  authServicio = inject(AuthService);

  modalId = 'modal-recurso';
  tituloModal = signal<string>('');
  dataModal = signal<dataInformation | null>(null);
  recursoIdForEliminated = signal<number | null>(null);

  recursos = signal<any[]>([]);
  rolUser = signal<Roles | null>(null);
  idUser = signal<number | null>(null);
  recursoSeleccionado = signal<any | null>(null);
  filtroActivo = signal<string>('');

  ngOnInit(): void {
    this.cargarData();
  }

  cargarData() {
    const rol = this.authServicio.getRole();
    const id = this.authServicio.getId();
    
    if (rol && id) {
      this.rolUser.set(rol);
      this.idUser.set(id);
      
      this.recursoServicio.getRecursosDataFull().subscribe((recursos) => {
        this.recursos.set(recursos);
      });
    }
  }

  eliminarData() {
    const id = this.recursoIdForEliminated();
    if (id) {
      this.recursoServicio.eliminarRecursoLogico(id).subscribe({
        next: () => {
          this.modalStatusSuccess();
        },
        error: () => {
          this.modalStatusError();
        }
      });
    } else {
      this.modalStatusError();
    }
  }

  activarData(valueId: number) {
    if (valueId) {
      this.recursoServicio.activarRecurso(valueId).subscribe({
        next: () => {
          this.modalStatusSuccess();
        },
        error: () => {
          this.modalStatusError();
        }
      });
    } else {
      this.modalStatusError();
    }
  }

  buscarDato(event: any) {
    const texto = event.target.value.toLowerCase().trim();

    if (texto === '') {
      this.cargarData();
      return;
    }

    this.recursoServicio.buscarRecursosPorNombre(texto).subscribe((recursos) => {
      this.recursos.set(recursos);
    });
  }

  FiltarDato(event: any) {
    const texto = event.target.value.trim();
    this.filtroActivo.set(texto);

    if (texto === '') {
      this.cargarData();
      return;
    }

    this.recursoServicio.filtrarRecursosPorEstado(texto).subscribe((recursos) => {
      this.recursos.set(recursos);
    });
  }

  abrirConfirmacion(id: number) {
    this.tituloModal.set('Confirmar Eliminación');
    this.dataModal.set('confirm');
    this.recursoIdForEliminated.set(id);
    const check = document.getElementById(`${this.modalId}`) as HTMLInputElement;
    if (check) check.checked = true;
  }
// se aplasta y veo mas de la lista de los recursos que llame get id 
  verDetalles(id: number) {
    this.recursoServicio.getRecursoPorId(id).subscribe((recurso) => {
      const recursoCompleto = {
        ...recurso,
        tipoRecursoNombre: this.recursos().find(r => r.id === id)?.tipoRecursoNombre || 'Sin tipo'
      };
      this.recursoSeleccionado.set(recursoCompleto);
      const modal = document.getElementById('modal-detalle-recurso') as HTMLDialogElement;
      if (modal) modal.showModal();
    });
  }
  
  cerrarDetalles() {
    const modal = document.getElementById('modal-detalle-recurso') as HTMLDialogElement;
    if (modal) modal.close();
    this.recursoSeleccionado.set(null);
  }

  modalStatusSuccess() {
    this.tituloModal.set('Éxitoso');
    this.dataModal.set('success');
    const check = document.getElementById(`${this.modalId}`) as HTMLInputElement;
    if (check) check.checked = true;
    this.cargarData();
    setTimeout(() => {
      const check = document.getElementById(`${this.modalId}`) as HTMLInputElement;
      if (check) {
        check.checked = false;
        this.dataModal.set(null);
        this.tituloModal.set('');
        this.recursoIdForEliminated.set(null);
      }
    }, 1500);
  }

  modalStatusError() {
    this.tituloModal.set('Error');
    this.dataModal.set('error');

    const check = document.getElementById(`${this.modalId}`) as HTMLInputElement;
    if (check) check.checked = true;
    this.cargarData();
    setTimeout(() => {
      const check = document.getElementById(`${this.modalId}`) as HTMLInputElement;
      if (check) {
        check.checked = false;
        this.dataModal.set(null);
        this.tituloModal.set('');
        this.recursoIdForEliminated.set(null);
      }
    }, 1500);
  }
}