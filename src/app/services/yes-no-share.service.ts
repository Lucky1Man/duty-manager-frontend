import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

type Decision<TIssuer> = { issuer: TIssuer; decision: boolean };

@Injectable({
  providedIn: 'root',
})
export class YesNoShareService<TIssuer> {
  private onDecisionSubject = new Subject<Decision<TIssuer>>();

  nextDecision(decision: Decision<TIssuer>) {
    this.onDecisionSubject.next(decision);
  }

  onDecision(callback: (decision: Decision<TIssuer>) => void) {
    return this.onDecisionSubject.subscribe(callback);
  }
}
