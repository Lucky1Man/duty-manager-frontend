import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { NgEventBus } from 'ng-event-bus';
import { HeaderComponent } from './header/header.component';
import { AuthenticationService } from './services/authentication.service';
import { AxiosService } from './services/axios.service';
import { ExecutionFactService } from './services/execution-fact.service';
import { ParticipantService } from './services/participant.service';
import { TemplateService } from './services/template.service';
import { SideNavComponent } from './side-nav/side-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    MatSidenavModule,
    SideNavComponent
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
    ParticipantService,
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
