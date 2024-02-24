import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Participant, Role } from '../../shared/participant';
import { ExecutionFact } from '../../shared/execution-fact';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'execution-fact-item',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule],
  templateUrl: './execution-fact-item.component.html',
  styleUrl: './execution-fact-item.component.css',
})
export class ExecutionFactItemComponent {
  @Input() executionFact = new ExecutionFact();
}
