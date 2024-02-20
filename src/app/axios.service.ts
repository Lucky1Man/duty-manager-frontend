import { Injectable, Injector } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { LoginFormComponent } from './login-form/login-form.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Participant } from '../shared/participant';

@Injectable({
  providedIn: 'root',
})
export class AxiosService {
  constructor(
    private dialog: MatDialog,
    injector: Injector,
    router: Router,
    snackBar: MatSnackBar
  ) {
    axios.defaults.baseURL = 'http://localhost:8080/api/v1';
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    axios.interceptors.response.use(null, (error : AxiosError) => {
      if (error.response!.status === 403 && router.url !== '/login') {
        this.dialog.open(LoginFormComponent, {
          injector: injector,
        });
      }
      if(error.config!.url === 'auth/jwt') {
        snackBar.open('Login or password are incorrect!', undefined, {duration: 2000});
      }
      return Promise.reject(error);
    });
  }

  getAuthToken(): string | null {
    return window.localStorage.getItem('auth_token');
  }

  setAuthToken(participant: Participant | null): void {
    if (participant !== null) {
      window.localStorage.setItem('auth_token', participant.jwt);
      window.localStorage.setItem('participant', JSON.stringify(participant));
    } else {
      window.localStorage.removeItem('auth_token');
      window.localStorage.removeItem('participant');
    }
  }

  request(
    method: string,
    url: string,
    data?: any
  ): Promise<AxiosResponse<any, any>> {
    let headers = {};

    if (this.getAuthToken() !== null) {
      headers = { Authorization: 'Bearer ' + this.getAuthToken() };
    }
    return axios({
      method: method,
      url: url,
      data: data,
      headers: headers,
    });
  }
}
