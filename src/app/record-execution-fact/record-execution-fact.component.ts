import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipListboxChange, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgEventBus } from 'ng-event-bus';
import { Duty } from '../../shared/duty';
import { CommonModule } from '@angular/common';
import { Events } from '../../shared/duty-manager-events';

@Component({
  selector: 'record-execution-fact',
  standalone: true,
  imports: [
    MatButtonModule,
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    CommonModule,
    MatCheckboxModule,
  ],
  templateUrl: './record-execution-fact.component.html',
  styleUrl: './record-execution-fact.component.scss',
})
export class RecordExecutionFactComponent {
  senderDescription = new FormControl('', [Validators.required]);
  senderInstant = new FormControl('');
  descriptions = new Set<string>();
  duties = new Map<string, Duty>();
  selectedDuty: Duty | undefined;
  constructor(private eventBus: NgEventBus) {
    eventBus
      .on(Events.DUTIES_FETCHED)
      .subscribe((event) => this.setDuties(event.data as Duty[]));
    eventBus
      .on(Events.LOGGED_IN)
      .subscribe(() => eventBus.cast(Events.FETCH_DUTIES));
    eventBus.cast(Events.FETCH_DUTIES);
  }

  private setDuties(duties: Duty[]) {
    duties.forEach((duty) => this.duties.set(duty.name, duty));
    this.duties.forEach((duty) => this.descriptions.add(duty.description));
  }

  setExecutionFactNewParent(event: MatChipListboxChange) {
    this.selectedDuty = this.duties.get(event.value);
    let description = this.selectedDuty?.description;
    if (description === undefined) {
      description = '';
    }
    if (
      !this.senderDescription.dirty ||
      this.senderDescription.value === '' ||
      (this.senderDescription.value !== null &&
        this.descriptions.has(this.senderDescription.value))
    ) {
      this.senderDescription.setValue(description);
    }
  }

  getErrorMessage() {
    return 'Either select parent or describe what you did.';
  }

  recordExecutionFact() {
    let dutyId = '';
    if (this.selectedDuty) {
      dutyId = this.selectedDuty.id;
    }
    if (this.senderDescription.value && this.senderDescription.valid) {
      this.eventBus.cast(Events.RECORD_EXECUTION_FACT, {
        dutyId: dutyId,
        description: this.senderDescription.value,
        instant: this.senderInstant.value,
      });
    }
  }
}
