import { Component, Inject, Injector, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgScrollbar } from 'ngx-scrollbar';
import { AutoClosableComponent } from '../../shared/AutoClosableComponent';
import { Template } from '../../shared/template';
import { getErrorMessage } from '../../shared/validation-errors-getter';
import { TemplateActionsShareService } from '../services/template-actions-share.service';
import { YesNoShareService } from '../services/yes-no-share.service';
import { YesNoDialogComponent } from '../yes-no-dialog/yes-no-dialog.component';
import { nameNotSameValidator } from './name-not-same-validator';

@Component({
  selector: 'template-item',
  standalone: true,
  imports: [
    MatCardModule,
    NgScrollbar,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './template-item.component.html',
  styleUrl: './template-item.component.scss',
})
export class TemplateItemComponent
  extends AutoClosableComponent
  implements OnInit
{
  @Input() template = new Template('placeholder', 'placeholder', 'placeholder');

  updateTemplateForm = new FormGroup({
    senderTemplateName: new FormControl<string>(''),
    senderTemplateDescription: new FormControl<string>(''),
  });

  constructor(
    private templateActionShare: TemplateActionsShareService,
    @Inject('templateYesNoShare')
    private yesNoShareService: YesNoShareService<Template>,
    private dialog: MatDialog
  ) {
    super();
    super.manage(
      yesNoShareService.onDecision((decision) => {
        if (decision.decision && decision.issuer.id === this.template.id) {
          templateActionShare.nextDelete(this.template.id);
        }
      })
    );
  }

  ngOnInit(): void {
    this.updateTemplateForm = new FormGroup({
      senderTemplateName: new FormControl<string>('', [
        Validators.maxLength(100),
        nameNotSameValidator(this.template),
      ]),
      senderTemplateDescription: new FormControl<string>('', [
        Validators.maxLength(500),
      ]),
    });
  }

  updateTemplate() {
    const newName = this.updateTemplateForm.get('senderTemplateName')?.value;
    const newDescription = this.updateTemplateForm.get(
      'senderTemplateDescription'
    )?.value;
    if (newName && newDescription && this.updateTemplateForm.valid)
      this.templateActionShare.nextUpdate({
        id: this.template.id,
        name: newName,
        description: newDescription,
      });
  }

  deleteTemplate() {
    this.dialog.open(YesNoDialogComponent<Template>, {
      injector: Injector.create({
        providers: [
          { provide: YesNoShareService<Template>, useValue: this.yesNoShareService },
        ],
      }),
      data: {
        title: `Do you want to delete "${this.template.name}" template`,
        message: 'This action can not be reversed.',
        issuer: this.template,
      },
    });
  }

  getErrorMessage(formControlName: string) {
    return getErrorMessage(formControlName, this.updateTemplateForm);
  }
}
