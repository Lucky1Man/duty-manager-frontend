import { HttpClientModule } from '@angular/common/http';
import { AfterContentInit, AfterRenderRef, AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterOutlet } from '@angular/router';
import { AxiosError } from 'axios';
import { MetaData, NgEventBus } from 'ng-event-bus';
import { Duty } from '../shared/duty';
import { Participant } from '../shared/participant';
import { AxiosService } from './axios.service';
import { HeaderComponent } from './header/header.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { Events } from '../shared/duty-manager-events';
import { AuthenticationService } from './authentication.service';
import { ExecutionFact } from '../shared/execution-fact';

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
  styleUrl: './app.component.css',
  providers: [NgEventBus, AxiosService, MatDialog, AuthenticationService],
})
export class AppComponent implements OnInit {
  constructor(
    private axios: AxiosService,
    private eventBus: NgEventBus,
    private authenticationService: AuthenticationService,
    private snackBar: MatSnackBar
  ) {
    eventBus.on(Events.FETCH_DUTIES).subscribe(() => this.castDuties());
    eventBus
      .on(Events.FETCH_EXECUTION_FACTS)
      .subscribe(() => this.castExecutionFacts());
    eventBus
      .on(Events.RECORD_EXECUTION_FACT)
      .subscribe((recordMeta: MetaData<any>) => this.recordExecutionFact(recordMeta.data));
  }

  ngOnInit(): void {
    this.authenticationService.checkIfAlreadyLoggedIn();
  }

  private castDuties(): void {
    this.axios.request('get', 'duties').then((returnedDuties) => {
      this.eventBus.cast(Events.DUTIES_FETCHED, returnedDuties.data as Duty[]);
    });
  }

  private castExecutionFacts(): void {
    this.axios
      .request('get', 'execution-facts/active', null, {
        from: '2024-01-23T07:30:47',
        executorId: this.axios.getParticipant()?.id,
      })
      .then((returnedDuties) => {
        this.eventBus.cast(
          Events.EXECUTION_FACTS_FETCHED,
          returnedDuties.data as ExecutionFact[]
        );
      });
  }

  private recordExecutionFact(data: any): void {
    const newLocal = {
      ...data,
      executorId: this.axios.getParticipant()?.id,
    };
    this.axios
      .request('post', 'execution-facts', newLocal)
      .then(() => this.eventBus.cast(Events.FETCH_EXECUTION_FACTS))
      .catch((error: AxiosError<any, any>) => this.snackBar.open(error.response?.data.message, undefined, {duration: 10000}));
  }
}
