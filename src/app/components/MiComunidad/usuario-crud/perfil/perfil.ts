import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { UsuarioResponse } from '../../../../models/usuario.model';
import { UsuarioService } from '../../../../services/usuario.service';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.html',
})
export class PerfilComponent implements OnInit {

  usuario!: UsuarioResponse;
  cargando = true;

  constructor(
    private auth: AuthService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    const user = this.auth.getUserFromToken();
    if (!user) return;

    const userId = Number(user.sub);

    this.usuarioService.getUsuarioPorId(userId).subscribe({
      next: (data) => {
        this.usuario = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  guardarCambios(): void {
    console.log('Usuario actualizado:', this.usuario);

    // Aquí luego:
    // this.usuarioService.updateUsuario(this.usuario).subscribe(...)
  }
}
