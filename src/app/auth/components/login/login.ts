import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ModalsAlert } from "../../../components/shared/modals-alert/modals-alert";

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ModalsAlert]
})
export class LoginComponent {

  form: FormGroup;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      passHash: ['', Validators.required]
    });
  }

  modalData: 'success' | 'error' | null = null;
  modalId = 'loginModal';

  login() {
    if (this.form.invalid) return;

    this.auth.login(this.form.value).subscribe({
      next: () => {
        this.modalData = 'success';
      },
      error: () => {
        this.modalData = 'error';
      }
    });
  }


  
}
