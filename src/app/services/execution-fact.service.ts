import { Injectable } from '@angular/core';
import { NgEventBus } from 'ng-event-bus';
import { Events } from '../../shared/duty-manager-events';
import { ExecutionFact } from '../../shared/execution-fact';
import { AxiosService } from './axios.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AxiosError, AxiosResponse } from 'axios';
import { Subject, Subscription } from 'rxjs';

type NewExecutionFactsCallback = (facts: ExecutionFact[]) => void;

type RecordExecutionFact = {
  dutyId: string;
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
    eventBus: NgEventBus
  ) {
    eventBus.on(Events.LOGGED_IN).subscribe(() => this.fetchExecutionFacts());
  }

  subscribeToNewExecutionFacts(
    callback: NewExecutionFactsCallback
  ): Subscription {
    return this.executionFactsSubject.asObservable().subscribe(callback);
  }

  fetchExecutionFacts() {
    this.axios
      .request('get', 'execution-facts/active', null, {
        from: '2024-01-23T07:30:47',
        executorId: this.axios.getParticipant()?.id,
      })
      .then((returnedTemplates) => {
        this.executionFactsSubject.next(returnedTemplates.data);
      })
      .catch((error: AxiosError<any, any>) => this.alertUser(error));
  }

  finishExecutionFact(id: string) {
    this.axios
      .request('post', 'execution-facts/finished', id)
      .then(() => this.fetchExecutionFacts())
      .catch((error: AxiosError<any, any>) => this.alertUser(error));
  }

  registerExecutionFact(recordExecutionFact: RecordExecutionFact) {
    this.axios
      .request('post', 'execution-facts', {
        ...recordExecutionFact,
        executorId: this.axios.getParticipant()?.id,
      })
      .then(() => this.fetchExecutionFacts())
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
