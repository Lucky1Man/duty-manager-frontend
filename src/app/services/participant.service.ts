import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AxiosError } from 'axios';
import { Participant } from '../../shared/participant';
import { AxiosService } from './axios.service';

@Injectable({
  providedIn: 'root',
})
export class ParticipantService {
  constructor(private axios: AxiosService, private snackBar: MatSnackBar) {}

  async fetchParticipants(): Promise<Participant[]> {
    try {
      const response = await this.axios.request('get', 'participants');
      return response.data as Participant[];
    } catch (error: any) {
      this.alertUser(error);
      return Promise.reject(error);
    }
  }

  private alertUser(error: AxiosError<any, any>) {
    this.snackBar.open(
      error.response?.data.message ?? error.message,
      undefined,
      {
        duration: 10000,
      }
    );
  }
}
