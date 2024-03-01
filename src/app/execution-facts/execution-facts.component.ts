import { Component, Input, OnDestroy } from '@angular/core';
import { ExecutionFactsListComponent } from '../execution-facts-list/execution-facts-list.component';
import { RecordExecutionFactComponent } from '../record-execution-fact/record-execution-fact.component';
import { ExecutionFactsFilterComponent } from '../execution-facts-filter/execution-facts-filter.component';
import { MatDividerModule } from '@angular/material/divider';
import { ExecutionFactService } from '../services/execution-fact.service';
import { ExecutionFact } from '../../shared/execution-fact';
import {
  ExecutionFactFilter,
  ExecutionFactLoadParameters,
} from '../../shared/facts-filter-types';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { ExecutionFactsLoadSettingsShareService } from '../services/execution-facts-load-settings-share.service';

@Component({
  selector: 'app-execution-facts',
  standalone: true,
  imports: [
    ExecutionFactsListComponent,
    RecordExecutionFactComponent,
    ExecutionFactsFilterComponent,
    MatDividerModule,
  ],
  providers: [ExecutionFactsLoadSettingsShareService],
  templateUrl: './execution-facts.component.html',
  styleUrl: './execution-facts.component.scss',
})
export class ExecutionFactsComponent implements OnDestroy {
  private subscriptions: Subscription[] = [];
  private _executionFacts: ExecutionFact[] = [];
  private _executionFactFilters: ExecutionFactFilter[] = [];
  private _executionFactsLoadParameters?: ExecutionFactLoadParameters;
  private _executionFactsStateFilter: ExecutionFactFilter = () => true;

  constructor(
    private factService: ExecutionFactService,
    factsLoadingSettings: ExecutionFactsLoadSettingsShareService
  ) {
    this.subscriptions.push(
      factService.subscribeToExecutionFacts((facts) => {
        this._executionFacts = facts;
      })
    );
    this.subscriptions.push(
      factsLoadingSettings.subscribeToLoadSettings((setting) => {
        this.parameters = setting;
      })
    );
    this.fetchExecutionFacts();
  }

  private async fetchExecutionFacts() {
    this.factService.fetchExecutionFacts(
      this._executionFactsLoadParameters?.from,
      this._executionFactsLoadParameters?.to
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  get executionFacts(): ExecutionFact[] {
    return this._executionFacts.filter(
      (fact) =>
        this._executionFactFilters.every((filter) => filter(fact)) &&
        this._executionFactsStateFilter(fact)
    );
  }

  set filters(filters: ExecutionFactFilter[]) {
    this._executionFactFilters = filters;
  }

  set stateFilter(filter: ExecutionFactFilter) {
    this._executionFactsStateFilter = filter;
  }

  set parameters(parameters: ExecutionFactLoadParameters) {
    this._executionFactsLoadParameters = parameters;
    this.fetchExecutionFacts();
  }
}
