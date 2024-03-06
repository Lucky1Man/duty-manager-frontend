import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ExecutionFactLoadParameters as ExecutionFactLoadSettings, FactsLoadParametersApplier } from '../../shared/execution-facts-types';

@Injectable({
  providedIn: 'root'
})
export class ExecutionFactsLoadParametersShareService {

  private loadParametersSubject = new Subject<ExecutionFactLoadSettings>();

  constructor() { }

  onLoadParameters(settingsApplier: FactsLoadParametersApplier) {
    return this.loadParametersSubject.subscribe(settingsApplier);
  }

  nextLoadParameters(settings: ExecutionFactLoadSettings) {
    this.loadParametersSubject.next(settings);
  }
}
