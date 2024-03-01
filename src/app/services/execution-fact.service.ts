import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AxiosError } from 'axios';
import { NgEventBus } from 'ng-event-bus';
import { Subject, Subscription } from 'rxjs';
import { Events } from '../../shared/duty-manager-events';
import { ExecutionFact } from '../../shared/execution-fact';
import { AxiosService } from './axios.service';

type NewExecutionFactsCallback = (facts: ExecutionFact[]) => void;

type RecordExecutionFact = {
  templateId: string;
  description: string;
  instant: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class ExecutionFactService {
  private executionFactsSubject = new Subject<ExecutionFact[]>();

  constructor(
    private axios: AxiosService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    eventBus: NgEventBus
  ) {
    eventBus.on(Events.LOGGED_IN).subscribe(() => {
      this.fetchExecutionFacts();
    });
  }

  subscribeToExecutionFacts(callback: NewExecutionFactsCallback): Subscription {
    return this.executionFactsSubject.asObservable().subscribe(callback);
  }

  fetchExecutionFacts(
    from: Date = new Date('1/1/2024'),
    to?: Date,
    executorId: string = this.axios.getParticipant()?.id ?? ''
  ) {
    const requestPromise = this.axios.request(
      'get',
      'execution-facts',
      null,
      {
        from: this.datePipe.transform(from, 'yyyy-MM-ddTHH:mm:ss'),
        executorId: executorId,
        to: this.datePipe.transform(to, 'yyyy-MM-ddTHH:mm:ss'),
      }
    );
    requestPromise
      .then((returnedTemplates) => {
        this.executionFactsSubject.next(returnedTemplates.data);
      })
      .catch((error: AxiosError<any, any>) => this.alertUser(error));
    return requestPromise;
  }

  finishExecutionFact(id: string) {
    this.axios.request('post', 'execution-facts/finished', id)
      .then(() => this.fetchExecutionFacts())
      .catch((error: AxiosError<any, any>) => this.alertUser(error));
  }

  registerExecutionFact(recordExecutionFact: RecordExecutionFact) {
    this.axios
      .request('post', 'execution-facts', {
        ...recordExecutionFact,
        executorId: this.axios.getParticipant()?.id,
      })
      .then((response) => {
        if (recordExecutionFact.instant === true) {
          this.finishExecutionFact(response.data);
        }
        this.fetchExecutionFacts();
      })
      .catch((error: AxiosError<any, any>) => this.alertUser(error));
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
