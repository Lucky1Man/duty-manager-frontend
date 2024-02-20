import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgEventBus } from 'ng-event-bus';
import { Participant } from '../../shared/participant';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private _participant?: Participant;
  constructor(private eventBus: NgEventBus) {
    this._participant = this.getParticipantFromLocalStorage();
    eventBus
      .on('authChange')
      .subscribe(
        () => (this._participant = this.getParticipantFromLocalStorage())
      );
  }

  private getParticipantFromLocalStorage(): Participant | undefined {
    const stringParticipant = window.localStorage.getItem('participant');
    if (stringParticipant) {
      return JSON.parse(stringParticipant);
    }
    return undefined;
  }

  logout() {
    this.eventBus.cast('logout');
  }

  get participant() {
    return this._participant;
  }
}
