import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { ExecutionFact } from '../../shared/execution-fact';
import { ExecutionFactActionsShareService } from '../services/execution-fact-actions-share.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'execution-fact-item',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, MatChipsModule, RouterModule],
  templateUrl: './execution-fact-item.component.html',
  styleUrl: './execution-fact-item.component.scss',
})
export class ExecutionFactItemComponent {
  @Input() executionFact = new ExecutionFact();
  @Input() userAllowedToChangeFacts = true;
  constructor(private factsActionsService: ExecutionFactActionsShareService) {}
  finish() {
    this.factsActionsService.nextFactFinish(this.executionFact.id);
  }
  testify() {
    this.factsActionsService.nextTestimony(this.executionFact.id);
  }
}
