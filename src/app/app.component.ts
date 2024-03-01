import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';
import { NgEventBus } from 'ng-event-bus';
import { HeaderComponent } from './header/header.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { AuthenticationService } from './services/authentication.service';
import { AxiosService } from './services/axios.service';
import { ExecutionFactService } from './services/execution-fact.service';
import { TemplateService } from './services/template.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HttpClientModule,
    LoginFormComponent,
    HeaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    NgEventBus,
    AxiosService,
    MatDialog,
    AuthenticationService,
    ExecutionFactService,
    TemplateService,
    provideNativeDateAdapter(),
    DatePipe
  ],
})
export class AppComponent implements OnInit {
  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.authenticationService.checkIfAlreadyLoggedIn();
  }
}
