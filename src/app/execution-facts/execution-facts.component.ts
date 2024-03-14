import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { Subscription } from 'rxjs';
import { ExecutionFact } from '../../shared/execution-fact';
import {
  ExecutionFactFilter,
  ExecutionFactLoadParameters,
} from '../../shared/execution-facts-types';
import { ExecutionFactsFilterComponent } from '../execution-facts-filter/execution-facts-filter.component';
import { ExecutionFactsListComponent } from '../execution-facts-list/execution-facts-list.component';
import { RecordExecutionFactComponent } from '../record-execution-fact/record-execution-fact.component';
import { ExecutionFactService } from '../services/execution-fact.service';
import { ExecutionFactsLoadParametersShareService } from '../services/execution-facts-load-settings-share.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { NgEventBus } from 'ng-event-bus';
import { Events } from '../../shared/duty-manager-events';
import { ExecutionFactActionsShareService } from '../services/execution-fact-actions-share.service';
import { subDays } from 'date-fns';

@Component({
  selector: 'app-execution-facts',
  standalone: true,
  imports: [
    ExecutionFactsListComponent,
    RecordExecutionFactComponent,
    ExecutionFactsFilterComponent,
    MatDividerModule,
  ],
  providers: [
    ExecutionFactsLoadParametersShareService,
    ExecutionFactActionsShareService,
  ],
  templateUrl: './execution-facts.component.html',
  styleUrl: './execution-facts.component.scss',
})
export class ExecutionFactsComponent implements OnDestroy, OnInit {
  defaultLoadParameters = {
    from: subDays(new Date(), 7),
    to: new Date(),
  };

  private participantId?: string;
  private subscriptions: Subscription[] = [];
  private _executionFacts: ExecutionFact[] = [];
  private _executionFactFilters: ExecutionFactFilter[] = [];
  private _executionFactsLoadParameters: ExecutionFactLoadParameters =
    this.defaultLoadParameters;
  private _executionFactsStateFilter: ExecutionFactFilter = () => true;
  private _userAllowedToChangeFacts = true;

  constructor(
    private factService: ExecutionFactService,
    private factsLoadingParametersService: ExecutionFactsLoadParametersShareService,
    authService: AuthenticationService,
    route: ActivatedRoute,
    factsActionsService: ExecutionFactActionsShareService,
    eventBus: NgEventBus
  ) {
    this.subscriptions.push(
      route.queryParamMap.subscribe((params) => {
        this.participantId = params.get('participant-id') ?? undefined;
        if (this.participantId) {
          this._userAllowedToChangeFacts = authService.getParticipant()?.id === this.participantId;
          if(!this._userAllowedToChangeFacts) {
            this.loadExecutionFacts();
          }
        }
      })
    );
    this.subscriptions.push(
      this.factsLoadingParametersService.onLoadParameters((parameters) => {
        this.parameters = parameters;
      })
    );
    this.subscriptions.push(
      factsActionsService.onCreate((recordFact) =>
        this.factService
          .registerExecutionFact(recordFact)
          .then((id) => this.addExecutionFact(id))
      )
    );
    this.subscriptions.push(
      factsActionsService.onTestimony((id) => {
        this.factService
          .testifyExecutionFact(id)
          .then(() => this.replaceExecutionFact(id));
      })
    );
    this.subscriptions.push(
      factsActionsService.onFactFinish((id) =>
        this.factService
          .finishExecutionFact(id)
          .then(() => this.replaceExecutionFact(id))
      )
    );
    this.subscriptions.push(
      eventBus.on(Events.LOGGED_IN).subscribe(() => this.loadExecutionFacts())
    );
  }

  private async loadExecutionFacts() {
    this._executionFacts = await this.factService.fetchExecutionFacts(
      this._executionFactsLoadParameters.from,
      this._executionFactsLoadParameters.to,
      this.participantId
    );
  }

  private async replaceExecutionFact(id: string) {
    this._executionFacts.splice(
      this._executionFacts.findIndex((fact) => fact.id === id),
      1,
      await this.factService.fetchExecutionFact(id)
    );
  }

  private async addExecutionFact(id: string) {
    this._executionFacts.push(await this.factService.fetchExecutionFact(id));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  ngOnInit(): void {
    this.factsLoadingParametersService.nextLoadParameters(
      this._executionFactsLoadParameters
    );
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
    this.loadExecutionFacts();
  }

  get userAllowedToChangeFacts() {
    return this._userAllowedToChangeFacts;
  }
}
