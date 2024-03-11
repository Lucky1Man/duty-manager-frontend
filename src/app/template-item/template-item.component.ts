import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgScrollbar } from 'ngx-scrollbar';
import { Template } from '../../shared/template';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

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
export class TemplateItemComponent {
  @Input() template = new Template('placeholder', 'placeholder', 'placeholder');
}
