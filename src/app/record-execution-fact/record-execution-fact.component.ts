import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MatChipSelectionChange,
  MatChipsModule,
} from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgEventBus } from 'ng-event-bus';
import { Template } from '../../shared/template';
import { Events } from '../../shared/duty-manager-events';
import { ExecutionFactService } from '../services/execution-fact.service';
import { TemplateService } from '../services/template.service';

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
  templates = new Map<string, Template>();
  selectedTemplate: Template | undefined;

  constructor(
    private templatesService: TemplateService,
    private factService: ExecutionFactService
  ) {
    templatesService.subscribeToNewTemplates((templates) => this.setTemplates(templates));
    templatesService.fetchTemplates();
  }

  private setTemplates(templates: Template[]) {
    templates.forEach((template) => this.templates.set(template.name, template));
    this.templates.forEach((template) => this.descriptions.add(template.description));
  }

  getErrorMessage() {
    return 'Either select parent or describe what you did.';
  }

  recordExecutionFact() {
    let templateId = '';
    if (this.selectedTemplate) {
      templateId = this.selectedTemplate.id;
    }
    if (this.senderDescription.value && this.senderDescription.valid) {
      this.factService.registerExecutionFact({
        dutyId: templateId,
        description: this.senderDescription.value,
        instant: Boolean(this.senderInstant.value),
      });
    }
  }

  selectionChanged(event: MatChipSelectionChange) {
    if (this.selectedTemplate?.name === event.source.id) {
      this.selectedTemplate = undefined;
      this.senderDescription.setValue('');
      return;
    }
    this.selectedTemplate = this.templates.get(event.source.id);
    let description = this.selectedTemplate?.description ?? '';
    if (
      !this.senderDescription.dirty ||
      this.senderDescription.value === '' ||
      (this.senderDescription.value !== null &&
        this.descriptions.has(this.senderDescription.value))
    ) {
      this.senderDescription.setValue(description);
    }
  }
}
