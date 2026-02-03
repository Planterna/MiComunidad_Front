import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { ReservaService } from '../../services/reserva.service';
import { RecursoService } from '../../services/recurso.service';

@Component({
  selector: 'app-admin-home',
  imports: [RouterLink],
  templateUrl: './admin-home.html',
})


export class AdminHome implements OnInit {

  usuarioService = inject(UsuarioService);
  reservaService = inject(ReservaService);
  recursoService = inject(RecursoService);

  UserCount = signal<number>(0);
  RecursoCount = signal<number>(0);
  ReservaCount = signal<number>(0);

  ngOnInit() {
    this.reservaService.getReservas().subscribe(reservas => {
      this.ReservaCount.set(reservas.length);
    });

    this.recursoService.getRecurso().subscribe(recursos => {
      this.RecursoCount.set(recursos.length);
    });
    this.usuarioService.getNombreUsuarioCompleto().subscribe(usuarios => {
      this.UserCount.set(usuarios.length);
    });
  }

}


