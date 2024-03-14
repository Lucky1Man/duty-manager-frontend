import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { BrowserModule } from '@angular/platform-browser';
import { TemplateFilter } from '../../shared/templates-types';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'templates-filter',
  standalone: true,
  imports: [
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatIconModule,
  ],
  templateUrl: './templates-filter.component.html',
  styleUrl: './templates-filter.component.scss',
})
export class TemplatesFilterComponent {
  senderTemplateName = new FormControl<string>('', [Validators.maxLength(100)]);
  activeFilters: TemplateFilter[] = [];
  @Input() defaultPage = {pageIndex: 0, pageSize: 50}; 
  @Input() numberOfTemplates = 0;
  @Output() filtersChange = new EventEmitter<TemplateFilter[]>();
  @Output() pageChange = new EventEmitter<PageEvent>();

  updateFilters() {
    this.activeFilters = new Array<TemplateFilter>();
    const templateName = this.senderTemplateName.getRawValue();
    if (templateName && this.senderTemplateName.valid) {
      this.activeFilters.push((template) => {
        return template.name == templateName;
      });
    }
  }

  emitFilters() {
    this.filtersChange.emit(this.activeFilters);
  }

  clearFilters() {
    this.activeFilters = [];
  }
}
