import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../../services/usuario.service';
import { ReservaService } from '../../../../services/reserva.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReservaResponse, Estado } from '../../../../models/reserva.model';
import { RecursoService } from '../../../../services/recurso.service';
import { RecursoResponse } from '../../../../models/recurso.model';
import { ModalsAlert } from '../../../shared/modals-alert/modals-alert';
import { dataInformation } from '../../../../models/tarjetas-config.model';
import { AuthService } from '../../../../services/auth.service';
import { Roles, UsuarioResponse } from '../../../../models/usuario.model';

@Component({
  selector: 'app-reserva-formulario',
  imports: [ReactiveFormsModule, RouterLink, ModalsAlert],
  templateUrl: './reserva-formulario.html',
})
export class ReservaFormulario implements OnInit {
  //!DI
  fb = inject(FormBuilder);
  activateRoute = inject(ActivatedRoute);
  router = inject(Router);
  usuarioService = inject(UsuarioService);
  recursoService = inject(RecursoService);
  reservaService = inject(ReservaService);
  authService = inject(AuthService);

  //!Config
  modalId = 'modal-reserva';
  tituloModal = signal<string>('');
  dataModal = signal<dataInformation | null>(null);
  // reservaIdForUpdate = signal<number | null>(null);

  //! Data
  reserva = signal<ReservaResponse | null>(null);
  recursoNombres = signal<RecursoResponse[] | null>(null);
  usuarioNombres = signal<UsuarioResponse[] | null>(null);
  editingId = signal<number>(0);
  nombreUS = signal<string>('');
  usuarioId= signal<number | null>(null);
  rolUser = signal<Roles | null>(null); 


  //!Formulario
  reservaForm = this.fb.group({
    usuarioId: ['', [Validators.required]],
    recursoId: ['', [Validators.required]],
    fecha: ['', [Validators.required]],
    horaInicio: ['', [Validators.required]],
    horaFin: ['', [Validators.required]],
    motivo: ['', [Validators.required, Validators.minLength(5)]],
    estado: ['', []],
    activo: [false, []],
  });

  //! Crud
  ngOnInit(): void {
    const idReserva = this.activateRoute.snapshot.params['id'];
    const rol = this.authService.getRole();
    this.rolUser.set(rol);
    const id = this.authService.getId();
    this.usuarioId.set(id);
    console.log(rol, id)

    if (idReserva !== null && idReserva > 0) {
    
     this.editingId.set(+idReserva);

      
      this.reservaService.getReservasForId(+idReserva).subscribe((data) => {
        this.reserva.set(data);
        this.cargarData(rol!);

        this.abrirEdicion(data);
      });
    } else {
      this.cargarData(this.rolUser()!);
    }
  }


cargarData(rol: Roles){

  if((rol === 'Administrador' || rol === 'Encargado')  ){
    this.recursoService.getRecurso().subscribe((data) => this.recursoNombres.set(data))
    this.usuarioService.getNombreUsuarioCompleto().subscribe((data) => this.usuarioNombres.set(data))  
  }

  if(rol === 'Vecino'){
    this.recursoService.getRecurso().subscribe((data) => this.recursoNombres.set(data))
    this.usuarioService.getNombreUsuarioPorId(this.usuarioId()!).subscribe((data) => this.nombreUS.set(data))
  }

}

  abrirEdicion(reserva: ReservaResponse) {
    this.reservaForm.patchValue({
      usuarioId: reserva.usuarioId.toString(),
      recursoId: reserva.recursoId.toString(),
      fecha: reserva.fecha.toString(),
      horaInicio: reserva.horaInicio,
      horaFin: reserva.horaFin,
      motivo: reserva.motivo,
      estado: reserva.estado,
      activo: reserva.activo,
    });
  }

  guardar() {
    let data = this.reservaForm.value;
    let reserva: ReservaResponse = {
      usuarioId: Number(data.usuarioId),
      recursoId: Number(data.recursoId),
      fecha: data.fecha!,
      horaInicio: data.horaInicio!,
      horaFin: data.horaFin!,
      estado: data.estado!,
      motivo: data.motivo!,
      activo: data.activo!,
      fechaCreacion: new Date().toISOString(),
      fechaModificacion: new Date().toISOString(),
    };
    if (this.editingId() !== 0 ) {
      if (reserva !== null) {
        if(this.rolUser() === 'Vecino' ){
          this.reservaService.updateReserva({ ...reserva, id: this.editingId()!, estado: 'Pendiente' }).subscribe(() => {
            this.modalStatusSuccess();
          });
          setTimeout(() => {
            this.router.navigate(['/reserva']);
          }, 3000);
        }
        if (this.rolUser() === 'Administrador' || this.rolUser() === 'Encargado') {
          this.reservaService.updateReserva({ ...reserva, id: this.editingId()! }).subscribe(() => {
            this.modalStatusSuccess();
          });
          setTimeout(() => {
            this.router.navigate(['/reserva']);
          }, 3000);
        }

      } else {
        this.modalStatusError();
      }
    } else {
      if (reserva !== null) {
        this.reservaService.createReserva(reserva).subscribe(() => {
          this.modalStatusSuccess();
          setTimeout(() => {
            this.router.navigate(['/reserva']);
          }, 3000);
        });
      } else {
        this.modalStatusError();
      }
    }
  }

  //! Modal
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
