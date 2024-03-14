import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { PageEvent } from '@angular/material/paginator';
import { NgEventBus } from 'ng-event-bus';
import { ProcessingComponent } from '../../shared/ProcessingComponent';
import { Template } from '../../shared/template';
import { TemplateFilter } from '../../shared/templates-types';
import { CreateTemplateComponent } from '../create-template/create-template.component';
import { TemplateActionsShareService } from '../services/template-actions-share.service';
import { TemplateService } from '../services/template.service';
import { YesNoShareService } from '../services/yes-no-share.service';
import { TemplatesFilterComponent } from '../templates-filter/templates-filter.component';
import { TemplatesListComponent } from '../templates-list/templates-list.component';

@Component({
  selector: 'templates',
  standalone: true,
  imports: [
    TemplatesListComponent,
    CreateTemplateComponent,
    TemplatesFilterComponent,
    MatDivider,
  ],
  providers: [
    MatDialog,
    {
      provide: 'templateYesNoShare',
      useFactory: () => new YesNoShareService<Template>(),
    },
  ],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss',
})
export class TemplatesComponent
  extends ProcessingComponent<Template>
  implements OnInit
{
  private _filters: TemplateFilter[] = [];
  private _page = { pageIndex: 0, pageSize: 50 };
  private _numberOfTemplates = 0;

  constructor(
    private templateService: TemplateService,
    eventBus: NgEventBus,
    templateActionsShare: TemplateActionsShareService
  ) {
    super(eventBus, () => this.loadTemplates());
    super.manage(
      templateActionsShare.onCreate((newTemplate) =>
        templateService.createTemplate(newTemplate).then((id) => {
          super.addDataPiece(() => templateService.fetchTemplate(id));
        })
      )
    );
    super.manage(
      templateActionsShare.onUpdate((updatedTemplate) => {
        templateService.updateTemplate(updatedTemplate).then(() =>
          super.replaceDataPiece(
            (template) => template.id === updatedTemplate.id,
            () => templateService.fetchTemplate(updatedTemplate.id)
          )
        );
      })
    );
    super.manage(
      templateActionsShare.onDelete((id) => {
        templateService.deleteTemplate(id).then(() =>
          super.replaceDataPiece(
            (template) => template.id === id,
            () => Promise.resolve(null)
          )
        );
      })
    );
  }

  ngOnInit(): void {
    this.loadTemplates().then((templates) => super.replaceData(templates));
    this.loadNumberOfTemplates();
  }

  private async loadTemplates() {
    return this.templateService.fetchTemplates(
      this._page.pageIndex,
      this._page.pageSize
    );
  }

  private async loadNumberOfTemplates() {
    this._numberOfTemplates = await this.templateService.getNumberOfTemplates();
  }

  async loadNewPage(pageEvent: PageEvent) {
    this._page = pageEvent;
    super.replaceData(await this.loadTemplates());
  }

  get templates() {
    return super.data.filter((template) =>
      this._filters.every((filter) => filter(template))
    );
  }

  get numberOfTemplates() {
    return this._numberOfTemplates;
  }

  set filters(filters: TemplateFilter[]) {
    this._filters = filters;
  }

  get page() {
    return this._page;
  }

}
