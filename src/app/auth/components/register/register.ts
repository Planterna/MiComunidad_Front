import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './register.html',
})
export class RegisterComponent implements OnInit {
  //! DI
  fb = inject(FormBuilder);
  router = inject(Router);
  authService = inject(AuthService);

  //! Signals para alertas
  alertType = signal<'success' | 'error' | null>(null);
  alertMessage = signal<string>('');

  //! Formulario
  registerForm = this.fb.group({
    Cedula: ['', Validators.required],
    Nombres: ['', Validators.required],
    Apellidos: ['', Validators.required],
    Email: ['', [Validators.required, Validators.email]],
    Telefono: [''],
    Direccion: [''],
    PassHash: ['', Validators.required],
    AceptaNotificaciones: [true],
    RolId: 3
  });

  ngOnInit(): void {
    // Opcional: aquí podrías hacer prellenado si fuese necesario
  }

  register() {
    if (this.registerForm.invalid) {
      this.showError('Completa todos los campos obligatorios');
      return;
    }

    // Desestructuramos el formulario y construimos el objeto exacto para backend C#
    const formData = this.registerForm.value;

    const dataToSend = {
      Cedula: formData.Cedula,
      Nombres: formData.Nombres,
      Apellidos: formData.Apellidos,
      Email: formData.Email,
      PassHash: formData.PassHash,
      Telefono: formData.Telefono || null,
      Direccion: formData.Direccion || null,
      AceptaNotificaciones: formData.AceptaNotificaciones ?? true,
      RolId: 3// RolId y Estado no se envían: el backend los asigna automáticamente
    };

    console.log('Datos que se enviarán al backend:', dataToSend);

    this.authService.register(dataToSend).subscribe({
      next: (res: any) => {
        console.log('Respuesta del backend:', res);
        this.showSuccess(res?.message || 'Usuario registrado correctamente');
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err: any) => {
        console.error('Error del backend:', err);
        const msg = err.error?.message || 'Ocurrió un error al registrar el usuario';
        this.showError(msg);
      },
    });
  }

  private showSuccess(msg: string) {
    this.alertType.set('success');
    this.alertMessage.set(msg);
    this.autoHide();
  }

  private showError(msg: string) {
    this.alertType.set('error');
    this.alertMessage.set(msg);
    this.autoHide();
  }

  private autoHide() {
    setTimeout(() => {
      this.alertType.set(null);
      this.alertMessage.set('');
    }, 3000);
  }
}
