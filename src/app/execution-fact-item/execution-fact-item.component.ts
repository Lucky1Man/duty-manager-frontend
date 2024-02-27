import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { ExecutionFact } from '../../shared/execution-fact';

@Component({
  selector: 'execution-fact-item',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, MatChipsModule],
  templateUrl: './execution-fact-item.component.html',
  styleUrl: './execution-fact-item.component.scss',
})
export class ExecutionFactItemComponent {
  @Input() executionFact = new ExecutionFact();
  @Output() finishExecutionFact = new EventEmitter<string>();
  finish() {
    this.finishExecutionFact.emit(this.executionFact.id);
  }
}
