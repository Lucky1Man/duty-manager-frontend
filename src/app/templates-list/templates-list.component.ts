import { Component, Input } from '@angular/core';
import { Template } from '../../shared/template';
import { TemplateItemComponent } from '../template-item/template-item.component';

@Component({
  selector: 'templates-list',
  standalone: true,
  imports: [TemplateItemComponent],
  templateUrl: './templates-list.component.html',
  styleUrl: './templates-list.component.scss'
})
export class TemplatesListComponent {
  @Input() templates: Template[] = [];
}
