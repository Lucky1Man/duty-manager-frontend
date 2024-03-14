import { AxiosError } from 'axios';
import { AxiosService } from './axios.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export class ErrorAlertingService {
  constructor(private axios: AxiosService, private snackBar: MatSnackBar) {}

  async alertingRequest(
    method: string,
    url: string,
    data?: any,
    parameters?: any
  ): Promise<any> {
    try {
      const response = await this.axios.request(method, url, data, parameters);
      return response.data;
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
