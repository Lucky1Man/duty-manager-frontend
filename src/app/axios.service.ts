import { Injectable, Injector } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Participant } from '../shared/participant';
import { AuthenticationComponent } from './authentication/authentication.component';

@Injectable({
  providedIn: 'root',
})
export class AxiosService {
  loginFormOpened = false;
  participant?: Participant;

  constructor(
    private dialog: MatDialog,
    injector: Injector,
    router: Router,
    snackBar: MatSnackBar
  ) {
    axios.defaults.baseURL = 'http://localhost:8080/api/v1';
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    axios.interceptors.response.use(null, (error: AxiosError) => {
      const notAuthenticated = error.response!.status === 403;
      const loginIsCurrentPage = router.url === '/login';
      if (notAuthenticated && !loginIsCurrentPage && !this.loginFormOpened) {
        const dialogRef = this.dialog.open(AuthenticationComponent, {
          injector: injector,
        });
        this.loginFormOpened = true;
        dialogRef.afterClosed().subscribe(() => {
          this.loginFormOpened = false;
        });
      }
      if (notAuthenticated && loginIsCurrentPage) {
        snackBar.open('You are not logged in.', undefined, { duration: 2000 });
      }
      if (error.config!.url === 'auth/jwt') {
        snackBar.open('Login or password are incorrect!', undefined, {
          duration: 2000,
        });
      }
      return Promise.reject(error);
    });
  }

  getParticipant(): Participant | null {
    if (this.participant) {
      return this.participant;
    } else {
      const stringParticipant = window.localStorage.getItem('participant');
      if (stringParticipant === null) {
        return null;
      }
      const participant = JSON.parse(stringParticipant);
      this.participant = participant as Participant;
      return participant;
    }
  }

  setParticipant(participant: Participant | null): void {
    if (participant !== null) {
      window.localStorage.setItem('participant', JSON.stringify(participant));
      this.participant = participant;
    } else {
      window.localStorage.removeItem('participant');
      this.participant = undefined;
    }
  }

  request <T>(
    method: string,
    url: string,
    data?: any,
    parameters?: any
  ): Promise<AxiosResponse<any, T>> {
    let headers = {};

    const participant = this.getParticipant();
    if (participant !== null) {
      headers = { Authorization: 'Bearer ' + participant.jwt };
    }
    return axios({
      method: method,
      url: url,
      data: data,
      headers: headers,
      params: parameters,
    });
  }
}
