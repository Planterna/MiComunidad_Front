import { Component, signal } from "@angular/core";
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { RouterLink, Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
})
export class LoginComponent {
  form: FormGroup;

  alertType = signal<'success' | 'error' | null>(null);
  alertMessage = signal<string>('');

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      passHash: ['', Validators.required],
    });
  }

  login() {
    if (this.form.invalid) {
      this.showError('Completa todos los campos correctamente');
      return;
    }

    this.auth.login(this.form.value).subscribe({
      next: () => {
        this.showSuccess('Inicio de sesión exitoso');

        setTimeout(() => {
          const rol = this.auth.getRole();

          if (rol === 'Administrador') {
            this.router.navigate(['/usuario/dashboard']);
          } else {
            this.router.navigate(['/']);
          }
        }, 1200);
      },
      error: () => {
        this.showError('Correo o contraseña incorrectos');
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
    }, 1500);
  }
}
