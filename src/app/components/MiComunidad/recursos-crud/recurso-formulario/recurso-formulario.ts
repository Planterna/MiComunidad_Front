import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RecursoService } from '../../../../services/recurso.service';
import { TipoRecursoService, TipoRecursoResponse } from '../../../../services/tipo-recurso.service';
import { RecursoResponse } from '../../../../models/recurso.model';
import { ModalsAlert } from '../../../shared/modals-alert/modals-alert';
import { dataInformation } from '../../../../models/tarjetas-config.model';
import { AuthService } from '../../../../services/auth.service';
import { Roles } from '../../../../models/usuario.model';

@Component({
  selector: 'app-recurso-formulario',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ModalsAlert],
  templateUrl: './recurso-formulario.html',
})
export class RecursoFormulario implements OnInit {
  fb = inject(FormBuilder);
  activateRoute = inject(ActivatedRoute);
  router = inject(Router);
  recursoService = inject(RecursoService);
  tipoRecursoService = inject(TipoRecursoService);
  authService = inject(AuthService);

  modalId = 'modal-recurso';
  tituloModal = signal<string>('');
  dataModal = signal<dataInformation | null>(null);

  recurso = signal<RecursoResponse | null>(null);
  tiposRecurso = signal<TipoRecursoResponse[]>([]);
  editingId = signal<number>(0);
  rolUser = signal<Roles | null>(null);

  recursoForm = this.fb.group({
    tipoRecursoId: ['', [Validators.required, Validators.min(1)]],
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
    capacidad: ['', [Validators.min(0)]],
    stock: ['', [Validators.min(0)]],
    ubicacion: ['', [Validators.maxLength(200)]],
    imagenUrl: ['', [Validators.pattern(/^https?:\/\/.+/)]],
    estado: ['Disponible'],
  });

  ngOnInit(): void {
    const idRecurso = this.activateRoute.snapshot.params['id'];
    const rol = this.authService.getRole();
    this.rolUser.set(rol);

    this.cargarTiposRecurso();

    if (idRecurso !== null && idRecurso > 0) {
      this.editingId.set(+idRecurso);
      this.recursoService.getRecursoPorId(+idRecurso).subscribe((data) => {
        this.recurso.set(data);
        this.abrirEdicion(data);
      });
    }
  }

  cargarTiposRecurso() {
    this.tipoRecursoService.getTipoRecursos().subscribe((data) => {
      this.tiposRecurso.set(data);
    });
  }

  abrirEdicion(recurso: RecursoResponse) {
    this.recursoForm.patchValue({
      tipoRecursoId: recurso.tipoRecursoId.toString(),
      nombre: recurso.nombre,
      capacidad: recurso.capacidad?.toString() || '',
      stock: recurso.stock?.toString() || '',
      ubicacion: recurso.ubicacion || '',
      imagenUrl: recurso.imagenUrl || '',
      estado: recurso.estado || 'Disponible',
    });
  }

  guardar() {
    if (this.recursoForm.invalid) {
      this.modalStatusError();
      return;
    }

    let data = this.recursoForm.value;

    if (this.editingId() !== 0) {
      const tipoRecursoSeleccionado = this.tiposRecurso().find(t => t.id === Number(data.tipoRecursoId));
      
      if (!tipoRecursoSeleccionado) {
        this.modalStatusError();
        return;
      }

      const recursoActualizado = {
        id: this.editingId(),
        tipoRecursoId: Number(data.tipoRecursoId),
        tipoRecurso: tipoRecursoSeleccionado,
        nombre: data.nombre!,
        capacidad: data.capacidad ? Number(data.capacidad) : null,
        stock: data.stock ? Number(data.stock) : null,
        ubicacion: data.ubicacion || '',
        imagenUrl: data.imagenUrl || '',
        estado: data.estado || 'Disponible',
        fechaCreacion: this.recurso()?.fechaCreacion || new Date().toISOString(),
        fechaModificacion: new Date().toISOString(),
      };
      
      this.recursoService.actualizarRecurso(recursoActualizado).subscribe({
        next: () => {
          this.modalStatusSuccess();
          setTimeout(() => {
            this.router.navigate(['/recurso']);
          }, 2000);
        },
        error: () => {
          this.modalStatusError();
        }
      });
    } else {
      const recursoNuevo = {
        tipoRecursoId: Number(data.tipoRecursoId),
        nombre: data.nombre!.trim(),
        capacidad: data.capacidad ? Number(data.capacidad) : 0,
        stock: data.stock ? Number(data.stock) : 0,
        ubicacion: data.ubicacion || "",
        imagenUrl: data.imagenUrl || "",
        estado: data.estado || "Disponible"
      };
      
      this.recursoService.crearRecurso(recursoNuevo).subscribe({
        next: () => {
          this.modalStatusSuccess();
          setTimeout(() => {
            this.router.navigate(['/recurso']);
          }, 2000);
        },
        error: () => {
          this.modalStatusError();
        }
      });
    }
  }

  abrirConfirmacion() {
    this.tituloModal.set('Confirmar');
    this.dataModal.set('confirm');
    const check = document.getElementById(`${this.modalId}`) as HTMLInputElement;
    if (check) check.checked = true;
  }

  modalStatusSuccess() {
    this.tituloModal.set('Éxitoso');
    this.dataModal.set('success');
    setTimeout(() => {
      const check = document.getElementById(`${this.modalId}`) as HTMLInputElement;
      if (check) {
        check.checked = false;
        this.dataModal.set(null);
        this.tituloModal.set('');
      }
    }, 1500);
  }

  modalStatusError() {
    this.tituloModal.set('Error');
    this.dataModal.set('error');
    setTimeout(() => {
      const check = document.getElementById(`${this.modalId}`) as HTMLInputElement;
      if (check) {
        check.checked = false;
        this.dataModal.set(null);
        this.tituloModal.set('');
      }
    }, 1500);
  }
}