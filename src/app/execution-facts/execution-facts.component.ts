import { Component } from '@angular/core';
import { ExecutionFactsListComponent } from '../execution-facts-list/execution-facts-list.component';
import { RecordExecutionFactComponent } from '../record-execution-fact/record-execution-fact.component';

@Component({
  selector: 'app-execution-facts',
  standalone: true,
  imports: [ExecutionFactsListComponent, RecordExecutionFactComponent],
  templateUrl: './execution-facts.component.html',
  styleUrl: './execution-facts.component.scss'
})
export class ExecutionFactsComponent {

}
