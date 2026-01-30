import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../../services/usuario.service';
import { ReservaService } from '../../../../services/reserva.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReservaResponse, Estado } from '../../../../models/reserva.model';
import { RecursoService } from '../../../../services/recurso.service';
import { RecursoResponse } from '../../../../models/recurso.model';

@Component({
  selector: 'app-reserva-formulario',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reserva-formulario.html',
})
export class ReservaFormulario implements OnInit {
  fb = inject(FormBuilder);
  activateRoute = inject(ActivatedRoute);
  router = inject(Router);
  usuarioService = inject(UsuarioService);
  recursoService = inject(RecursoService);
  reservaService = inject(ReservaService);

  reserva = signal<ReservaResponse | null>(null);
  recursoNombres = signal<RecursoResponse[] | null>(null);
  editingId = signal<number>(0);
  nombreUS = signal<string>('');
  valueUs = signal<number>(0);

  reservaForm = this.fb.group({
    usuarioId: ['', [Validators.required]],
    recursoId: ['', [Validators.required]],
    fecha: ['', [Validators.required]],
    horaInicio: ['', [Validators.required]],
    horaFin: ['', [Validators.required]],
    motivo: ['', [Validators.required, Validators.minLength(5)]],
    estado: ['', [Validators.required]],
    activo: [false, []],
  });

  ngOnInit(): void {
    const id = this.activateRoute.snapshot.params['id'];

    if (id !== null && id > 0) {
      this.editingId.set(+id);
      this.recursoService.getRecurso().subscribe((data) => this.recursoNombres.set(data));
      this.reservaService.getReservasForId(+id).subscribe((data) => {
        this.valueUs.set(data.usuarioId);
        this.reserva.set(data);
        this.cargarNombreUser(data.usuarioId);
        this.abrirEdicion(data);
      });
    } else {
      this.recursoService.getRecurso().subscribe((data) => this.recursoNombres.set(data));
    }
  }

  cargarNombreUser(id: number) {
    return this.usuarioService
      .getNombreUsuarioPorId(id)
      .subscribe((data) => this.nombreUS.set(data));
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
    if (this.editingId() !== 0) {
      let reserva: ReservaResponse = {
        id: this.editingId(),
        usuarioId: Number(data.usuarioId),
        recursoId: Number(data.recursoId),
        fecha: data.fecha!,
        horaInicio: data.horaInicio!,
        horaFin: data.horaFin!,
        motivo: data.motivo!,
        estado: data.estado!,
        activo: data.activo!,
        fechaCreacion: new Date().toISOString(),
        fechaModificacion: new Date().toISOString(),
      };
      this.reservaService.updateReserva(reserva).subscribe(() => {
        console.log({ reserva });
        // this.info.set('success');
      });
      setTimeout(() => {
        this.router.navigate(['/reserva']);
      }, 4000);
    } else {
      // this.reservaService.createReserva(datos).subscribe(() => {
      //   // this.info.set('success');
      // });
      setTimeout(() => {
        this.router.navigate(['/reserva']);
      }, 4000);
    }
  }
}
