import { Component, Optional } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgEventBus } from 'ng-event-bus';
import { MatTabsModule } from '@angular/material/tabs';
import {
  MatDialogContent,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'login-form',
  standalone: true,
  imports: [
    FormsModule,
    MatTabsModule,
    MatDialogContent,
    MatDialogClose,
    MatButtonModule,
  ],
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
    this.dialogRef?.close()
    this.eventBus.cast('doLogin', {
      login: this.login,
      password: this.password,
    });
  }
}
