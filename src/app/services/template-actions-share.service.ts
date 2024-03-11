import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CreateTemplate, UpdateTemplate } from '../../shared/templates-types';

@Injectable({
  providedIn: 'root',
})
export class TemplateActionsShareService {
  private onCreateTemplateSubject = new Subject<CreateTemplate>();
  private onUpdateTemplateSubject = new Subject<UpdateTemplate>();
  private onDeleteTemplateSubject = new Subject<string>();

  nextCreate(createTemplate: CreateTemplate) {
    this.onCreateTemplateSubject.next(createTemplate);
  }

  nextUpdate(updateTemplate: UpdateTemplate) {
    this.onUpdateTemplateSubject.next(updateTemplate);
  }

  nextDelete(id: string) {
    this.onDeleteTemplateSubject.next(id);
  }

  onCreate(callback: (createTemplate: CreateTemplate) => void) {
    return this.onCreateTemplateSubject.subscribe(callback);
  }

  onUpdate(callback: (createTemplate: UpdateTemplate) => void) {
    return this.onUpdateTemplateSubject.subscribe(callback);
  }

  onDelete(callback: (id: string) => void) {
    return this.onDeleteTemplateSubject.subscribe(callback);
  }
}
