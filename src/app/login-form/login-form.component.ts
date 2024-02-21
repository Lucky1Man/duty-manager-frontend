import { Component, Optional } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgEventBus } from 'ng-event-bus';

@Component({
  selector: 'login-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent {
  login = '';
  password = '';

  constructor(
    private eventBus: NgEventBus,
    @Optional() private dialogRef?: MatDialogRef<any>
  ) {}

  signIn() {
    this.dialogRef?.close();
    this.eventBus.cast('doLogin', {
      login: this.login,
      password: this.password,
    });
  }
}
