import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogContent } from '@angular/material/dialog';
import { LoginFormComponent } from '../login-form/login-form.component';
import { RegistrationFormComponent } from '../registration-form/registration-form.component';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [MatTabsModule, MatDialogContent, LoginFormComponent, RegistrationFormComponent],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css',
})
export class AuthenticationComponent {}
