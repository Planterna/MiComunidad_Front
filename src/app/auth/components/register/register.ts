import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ModalsAlert } from "../../../components/shared/modals-alert/modals-alert";

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ModalsAlert]
})
export class RegisterComponent {

  form: FormGroup;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      cedula: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      direccion: [''],
      passHash: ['', Validators.required],
      aceptaNotificaciones: [false]
    });
  }

  modalData: 'success' | 'error' | null = null;
  modalId = 'registerModal';

  register() {
    if (this.form.invalid) return;

    this.auth.register(this.form.value)
      .subscribe({
        next: () => this.modalData = 'success',
        error: () => this.modalData = 'error'
      });
  }

}
