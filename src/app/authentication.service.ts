import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AxiosError } from 'axios';
import { MetaData, NgEventBus } from 'ng-event-bus';
import { Events } from '../shared/duty-manager-events';
import { Participant } from '../shared/participant';
import { AxiosService } from './axios.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    private eventBus: NgEventBus,
    private axios: AxiosService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    eventBus
      .on(Events.LOGIN)
      .subscribe((credentials) => this.login(credentials.data));
    eventBus.on(Events.LOGOUT).subscribe(() => this.logout());
    eventBus
      .on(Events.REGISTER)
      .subscribe((register: MetaData<any>) => this.register(register.data));
  }

  checkIfAlreadyLoggedIn(): void {
    if (this.axios.getParticipant() !== null) {
      this.eventBus.cast(Events.LOGGED_IN, this.axios.getParticipant());
    }
  }

  private login(credentials: any) {
    this.axios
      .request('post', 'auth/jwt', {
        email: credentials.login,
        password: credentials.password,
      })
      .then((response) => {
        const participant = response.data as Participant;
        this.axios.setParticipant(participant);
        this.eventBus.cast(Events.LOGGED_IN, participant);
      })
      .catch(() => {
        this.axios.setParticipant(null);
        this.eventBus.cast(Events.LOGGED_OUT);
      });
  }

  private logout() {
    this.axios.setParticipant(null);
    this.eventBus.cast(Events.LOGGED_OUT);
    this.snackBar.open('You were logged out.', undefined, { duration: 2000 });
    this.router.navigate(['']);
  }

  private register(registerData: any) {
    this.axios.setParticipant(null);
    this.eventBus.cast(Events.LOGGED_OUT);
    this.axios
      .request('post', 'participants', registerData)
      .then(() =>
        this.eventBus.cast(Events.LOGIN, {
          login: registerData.email,
          password: registerData.password,
        })
      )
      .catch((error: AxiosError<any, any>) =>
        this.snackBar.open(error.response?.data?.message, undefined, {
          duration: 5000,
        })
      );
  }
}
