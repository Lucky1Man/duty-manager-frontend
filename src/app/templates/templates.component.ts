import { Component, OnInit } from '@angular/core';
import { Template } from '../../shared/template';
import { CreateTemplateComponent } from '../create-template/create-template.component';
import { TemplateService } from '../services/template.service';
import { TemplatesFilterComponent } from '../templates-filter/templates-filter.component';
import { TemplatesListComponent } from '../templates-list/templates-list.component';
import { MatDivider } from '@angular/material/divider';
import { TemplateFilter } from '../../shared/templates-types';

@Component({
  selector: 'templates',
  standalone: true,
  imports: [
    TemplatesListComponent,
    CreateTemplateComponent,
    TemplatesFilterComponent,
    MatDivider,
  ],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss',
})
export class TemplatesComponent implements OnInit {
  private _templates: Template[] = [];
  private _numberOfTemplates: number = 0;
  private _filters: TemplateFilter[] = [];

  constructor(private templateService: TemplateService) {}

  ngOnInit(): void {
    this.loadTemplates();
    this.loadNumberOfTemplates();
  }

  private async loadTemplates() {
    this._templates = await this.templateService.fetchTemplates();
  }

  private async loadNumberOfTemplates() {
    this._numberOfTemplates = await this.templateService.getNumberOfTemplates();
  }

  get templates() {
    return this._templates.filter((template) =>
      this._filters.every((filter) => filter(template))
    );
  }

  get numberOfTemplates() {
    return this._numberOfTemplates;
  }

  set filters(filters: TemplateFilter[]) {
    this._filters = filters;
  }
}
