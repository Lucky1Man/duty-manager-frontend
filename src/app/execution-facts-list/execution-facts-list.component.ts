import { Component } from '@angular/core';
import { ExecutionFactItemComponent } from '../execution-fact-item/execution-fact-item.component';
import { RecordExecutionFactComponent } from '../record-execution-fact/record-execution-fact.component';
import { MetaData, NgEventBus } from 'ng-event-bus';
import { Events } from '../../shared/duty-manager-events';
import { ExecutionFact } from '../../shared/execution-fact';

@Component({
  selector: 'execution-facts-list',
  standalone: true,
  imports: [ExecutionFactItemComponent, RecordExecutionFactComponent],
  templateUrl: './execution-facts-list.component.html',
  styleUrl: './execution-facts-list.component.scss',
})
export class ExecutionFactsListComponent {
  executionFacts = new Array<ExecutionFact>();
  constructor(private eventBus: NgEventBus) {
    eventBus
      .on(Events.EXECUTION_FACTS_FETCHED)
      .subscribe((facts: MetaData<any>) =>
        this.setExecutionFacts(facts.data as ExecutionFact[])
      );
    eventBus.cast(Events.FETCH_EXECUTION_FACTS);
  }

  private setExecutionFacts(facts: ExecutionFact[]) {
    this.executionFacts = facts;
  }
}
