import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TemplateActionsShareService } from '../services/template-actions-share.service';
import { getErrorMessage } from '../../shared/validation-errors-getter';
import { AutoClosableComponent } from '../../shared/AutoClosableComponent';

type CreateTemplateForm = {
  senderTemplateName: FormControl<string | null>;
  senderTemplateDescription: FormControl<string | null>;
};

@Component({
  selector: 'create-template',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  templateUrl: './create-template.component.html',
  styleUrl: './create-template.component.scss',
})
export class CreateTemplateComponent {
  createTemplateForm = new FormGroup({
    senderTemplateName: new FormControl<string>('', [
      Validators.maxLength(100), Validators.required
    ]),
    senderTemplateDescription: new FormControl<string>('', [
      Validators.maxLength(500), Validators.required
    ]),
  });

  constructor(private templateActionShare: TemplateActionsShareService) {
  }

  create() {
    const name = this.createTemplateForm.get('senderTemplateName')?.value;
    const description = this.createTemplateForm.get(
      'senderTemplateDescription'
    )?.value;
    if (name && description && this.createTemplateForm.valid) {
      this.templateActionShare.nextCreate({
        name: name,
        description: description,
      });
    }
  }

  
  getErrorMessage(formControlName: string) {
    return getErrorMessage(formControlName, this.createTemplateForm);
  }
}
