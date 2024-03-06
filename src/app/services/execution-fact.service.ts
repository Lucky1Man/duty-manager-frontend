import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AxiosError } from 'axios';
import { ExecutionFact } from '../../shared/execution-fact';
import { AxiosService } from './axios.service';
import { RecordExecutionFact } from '../../shared/execution-facts-types';

@Injectable({
  providedIn: 'root',
})
export class ExecutionFactService {
  constructor(
    private axios: AxiosService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {}

  async fetchExecutionFact(id: string) {
    try {
      const response = await this.axios.request('get', `execution-facts/${id}`);
      return response.data as ExecutionFact;
    } catch (error: any) {
      this.alertUser(error);
      return Promise.reject(error);
    }
  }

  async fetchExecutionFacts(
    from: Date = new Date('1/1/2024'),
    to?: Date,
    executorId: string = this.axios.getParticipant()?.id ?? ''
  ): Promise<ExecutionFact[]> {
    try {
      const response = await this.axios.request(
        'get',
        'execution-facts',
        null,
        {
          from: this.datePipe.transform(from, 'yyyy-MM-ddTHH:mm:ss'),
          executorId: executorId,
          to: this.datePipe.transform(to, 'yyyy-MM-ddTHH:mm:ss'),
        }
      );
      return response.data as ExecutionFact[];
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

  async finishExecutionFact(id: string): Promise<void> {
    try {
      await this.axios.request('post', 'execution-facts/finished', id);
    } catch (error: any) {
      this.alertUser(error);
      return Promise.reject(error);
    }
  }

  async registerExecutionFact(
    recordExecutionFact: RecordExecutionFact
  ): Promise<string> {
    try {
      const response = await this.axios.request('post', 'execution-facts', {
        ...recordExecutionFact,
        executorId: this.axios.getParticipant()?.id,
      });
      if (recordExecutionFact.instant === true) {
        await this.finishExecutionFact(response.data);
      }
      return response.data;
    } catch (error: any) {
      this.alertUser(error);
      return Promise.reject(error);
    }
  }

  async testifyExecutionFact(factId: string): Promise<string> {
    try {
      const response = await this.axios.request(
        'post',
        `execution-facts/${factId}/testimonies`
      );
      return response.data;
    } catch (error: any) {
      this.alertUser(error);
      return Promise.reject(error);
    }
  }
}
