import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AxiosError } from 'axios';
import { Template } from '../../shared/template';
import { AxiosService } from './axios.service';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  constructor(private axios: AxiosService, private snackBar: MatSnackBar) {}

  async fetchTemplates() : Promise<Template[]> {
    try {
      const response = await this.axios.request('get', 'templates');
      return response.data as Template[];
    } catch (error: any) {
      this.alertUser(error)
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
