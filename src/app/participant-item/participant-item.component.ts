import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Participant } from '../../shared/participant';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'participant-item',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './participant-item.component.html',
  styleUrl: './participant-item.component.scss'
})
export class ParticipantItemComponent {
  @Input() participant: Participant = new Participant();
  @Output() navigateToFactsPage = new EventEmitter<string>();

  emitParticipantId() {
    this.navigateToFactsPage.emit(this.participant.id);
  }
}
