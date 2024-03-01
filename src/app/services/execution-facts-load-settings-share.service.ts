import { Injectable } from '@angular/core';
import { ExecutionFactsComponent } from '../execution-facts/execution-facts.component';
import { Subject } from 'rxjs';
import { ExecutionFactLoadParameters as ExecutionFactLoadSettings, FactsLoadParametersApplier } from '../../shared/facts-filter-types';

@Injectable({
  providedIn: ExecutionFactsComponent
})
export class ExecutionFactsLoadSettingsShareService {

  private loadSettingsSubject = new Subject<ExecutionFactLoadSettings>();

  constructor() { }

  subscribeToLoadSettings(settingsApplier: FactsLoadParametersApplier) {
    return this.loadSettingsSubject.subscribe(settingsApplier);
  }

  async updateLoadSettings(settings: ExecutionFactLoadSettings) {
    this.loadSettingsSubject.next(settings);
  }
}
