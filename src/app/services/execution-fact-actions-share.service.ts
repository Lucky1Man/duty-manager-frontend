import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ExecutionFact } from '../../shared/execution-fact';
import { RecordExecutionFact } from '../../shared/execution-facts-types';

@Injectable({
  providedIn: 'root',
})
export class ExecutionFactActionsShareService {
  private onTestimonySubject = new Subject<string>();
  private onFactFinishSubject = new Subject<string>();
  private onCreateSubject = new Subject<RecordExecutionFact>();

  onTestimony(callback: (id: string) => void) {
    return this.onTestimonySubject.subscribe(callback);
  }

  onFactFinish(callback: (id: string) => void) {
    return this.onFactFinishSubject.subscribe(callback);
  }

  onCreate(callback: (fact: RecordExecutionFact) => void) {
    return this.onCreateSubject.subscribe(callback);
  }

  nextTestimony(id: string) {
    this.onTestimonySubject.next(id);
  }

  nextFactFinish(id: string) {
    this.onFactFinishSubject.next(id);
  }

  nextCreate(fact: RecordExecutionFact) {
    this.onCreateSubject.next(fact);
  }
}
