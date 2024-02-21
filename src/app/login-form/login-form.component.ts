import { CommonModule } from '@angular/common';
import { Component, Optional } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgEventBus } from 'ng-event-bus';
import { validatePassword } from '../registration-form/password-validator';
import { getErrorMessage } from '../registration-form/validation-errors-getter';

@Component({
  selector: 'login-form',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent {
  loginForm = new FormGroup({
    senderEmail: new FormControl('', [Validators.required, Validators.email]),
    senderPassword: new FormControl('', [
      Validators.required,
      validatePassword,
      Validators.minLength(8),
    ]),
  });
  hide = true;

  constructor(
    private eventBus: NgEventBus,
    @Optional() private dialogRef?: MatDialogRef<any>
  ) {}

  signIn() {
    if(this.loginForm.valid) {
      this.dialogRef?.close();
      this.eventBus.cast('doLogin', {
        login: this.loginForm.get('senderEmail')?.value,
        password: this.loginForm.get('senderPassword')?.value,
      });
    }
  }

  getErrorMessage(formControlName: string) {
    return getErrorMessage(formControlName, this.loginForm);
  }
}
