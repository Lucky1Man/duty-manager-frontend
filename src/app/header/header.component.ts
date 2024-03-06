import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MetaData, NgEventBus } from 'ng-event-bus';
import { Participant } from '../../shared/participant';
import { Events } from '../../shared/duty-manager-events';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private _participant?: Participant;
  @Output() sideNawStateChanged = new EventEmitter<void>()
  constructor(private eventBus: NgEventBus) {
    eventBus
      .on(Events.LOGGED_IN)
      .subscribe((participantData: MetaData<any>) =>
        this.setParticipant(participantData.data as Participant)
      );
    eventBus
      .on(Events.LOGGED_OUT)
      .subscribe(() => (this._participant = undefined));
  }

  private setParticipant(participant: Participant) {
    if (!this._participant) {
      this._participant = participant;
    } else if (!this._participant.equals(participant)) {
      this._participant = participant;
    }
  }

  logout() {
    this.eventBus.cast(Events.LOGOUT);
  }

  get participant() {
    return this._participant;
  }

  toggleMenu() {
    this.sideNawStateChanged.emit();
  }
}
