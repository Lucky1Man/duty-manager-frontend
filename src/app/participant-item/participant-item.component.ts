import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Participant } from '../../shared/participant';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ExecutionFactService } from '../services/execution-fact.service';
import { ExecutionFact } from '../../shared/execution-fact';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { AuthenticationService } from '../services/authentication.service';
import { subDays } from 'date-fns';

//This component has limitation, it is that if there was more than 200 facts in n day range,
// the list of facts will not correctly show facts that need to be testified, where n is number of most recent days to be shown.
// This needs to be fixed on server side. 

@Component({
  selector: 'participant-item',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatChipsModule, MatIconModule],
  templateUrl: './participant-item.component.html',
  styleUrl: './participant-item.component.scss',
})
export class ParticipantItemComponent implements OnInit {
  private static readonly MAX_EXECUTION_FACTS = 3;

  @Input() participant: Participant = new Participant();
  @Output() navigateToFactsPage = new EventEmitter<string>();

  executionFacts: ExecutionFact[] = [];
  userAllowedToFinishFact = false;

  constructor(
    private factService: ExecutionFactService,
    private authService: AuthenticationService
  ) {}
  ngOnInit(): void {
    this.initializeFacts();
  }

  private initializeFacts() {
    this.userAllowedToFinishFact =
      this.participant.id === this.authService.getParticipant()?.id;
    if (this.userAllowedToFinishFact) {
      this.loadActiveFacts();
    } else {
      this.loadNotTestified();
    }
  }

  private async loadActiveFacts() {
    this.executionFacts = await this.factService.fetchActiveExecutionFacts(
      new Date('1/1/2024'),
      undefined,
      this.participant.id,
      ParticipantItemComponent.MAX_EXECUTION_FACTS
    );
  }

  private async loadNotTestified() {
    const loaded = await this.factService.fetchExecutionFacts(
      subDays(new Date(), 3),
      undefined,
      this.participant.id
    );
    this.executionFacts = loaded.filter(
      (fact) =>
        fact.testimonies.find(
          (testimony) =>
            testimony.witnessId === this.authService.getParticipant()?.id
        ) === undefined
    ).slice(0, ParticipantItemComponent.MAX_EXECUTION_FACTS);
  }

  emitParticipantId() {
    this.navigateToFactsPage.emit(this.participant.id);
  }

  finishExecutionFact(fact: ExecutionFact) {
    this.factService
      .finishExecutionFact(fact.id)
      .then(() => this.initializeFacts());
  }

  testifyExecutionFact(fact: ExecutionFact) {
    this.factService
      .testifyExecutionFact(fact.id)
      .then(() => this.initializeFacts());
  }
}
