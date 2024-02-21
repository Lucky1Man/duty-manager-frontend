import { CommonModule } from '@angular/common';
import { Component, Optional } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgEventBus } from 'ng-event-bus';
import { validatePassword } from './password-validator';

@Component({
  selector: 'registration-form',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.css',
})
export class RegistrationFormComponent {
  hide = true;
  constructor(
    private eventBus: NgEventBus,
    @Optional() private dialogRef?: MatDialogRef<any>
  ) {}

  registerForm = new FormGroup({
    senderFullName: new FormControl('', [Validators.required]),
    senderEmail: new FormControl('', [Validators.required, Validators.email]),
    senderPassword: new FormControl('', [
      Validators.required,
      validatePassword,
      Validators.minLength(8)
    ]),
  });

  getErrorMessage(formControlName: string): string {
    const formControl = this.registerForm.get(formControlName);
    if (formControl?.hasError('required')) {
      return 'This field is required';
    } else if (formControl?.hasError('email')) {
      return 'Invalid email';
    } else if (formControl?.hasError('minlength')) {
      return 'Password should be at least 8 symbols';
    }
    return this.errorsToText(formControl?.errors);
  }

  private errorsToText(errors: ValidationErrors | null | undefined): string {
    if (!errors) {
      return '';
    }
    let message = '';
    for (const prop in errors) {
      message += errors[prop] + ' ';
    }
    return message;
  }

  register() {
    if (this.registerForm.valid) {
      this.dialogRef?.close();
      this.eventBus.cast('register', {
        fullName: this.registerForm.get('senderFullName')?.value,
        email: this.registerForm.get('senderEmail')?.value,
        password: this.registerForm.get('senderPassword')?.value,
      });
    }
  }
}
