import { Component, OnDestroy } from '@angular/core';
import { ParticipantItemComponent } from '../participant-item/participant-item.component';
import { Participant } from '../../shared/participant';
import { ParticipantService } from '../services/participant.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NgEventBus } from 'ng-event-bus';
import { Events } from '../../shared/duty-manager-events';

@Component({
  selector: 'participants',
  standalone: true,
  imports: [ParticipantItemComponent],
  templateUrl: './participants.component.html',
  styleUrl: './participants.component.scss',
})
export class ParticipantsComponent {
  participants: Participant[] = [];

  constructor(
    private participantsService: ParticipantService,
    private router: Router,
    eventBus: NgEventBus
  ) {
    eventBus.on(Events.LOGGED_IN).subscribe(() => this.loadParticipants());
    this.loadParticipants();
  }

  private async loadParticipants() {
    this.participants = await this.participantsService.fetchParticipants();
  }

  navigateToParticipantsPage(participantId: string) {
    this.router.navigate(['execution-facts'], {
      queryParams: { 'participant-id': participantId },
    });
  }
}
