import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AxiosError } from 'axios';
import { Template } from '../../shared/template';
import { AxiosService } from './axios.service';
import { CreateTemplate, UpdateTemplate } from '../../shared/templates-types';
import { ErrorAlertingService } from './error-alerting-service';

@Injectable({
  providedIn: 'root',
})
export class TemplateService extends ErrorAlertingService {
  
  constructor(axios: AxiosService, snackBar: MatSnackBar) {
    super(axios, snackBar);
  }

  async fetchTemplates(
    page: number = 0,
    pageSize: number = 50
  ): Promise<Template[]> {
    return super.alertingRequest('get', 'templates', undefined, {
      page: page,
      pageSize: pageSize,
    });
  }

  async fetchTemplate(id: String): Promise<Template> {
    return super.alertingRequest('get', `templates/${id}`);
  }

  async getNumberOfTemplates(): Promise<number> {
    return super.alertingRequest('get', 'templates/quantity');
  }

  async createTemplate(newTemplate: CreateTemplate): Promise<string> {
    return super.alertingRequest('post', 'templates', newTemplate);
  }

  async updateTemplate(updatedTemplate: UpdateTemplate) {
    return super.alertingRequest('put', 'templates', updatedTemplate);
  }

  async deleteTemplate(id: String): Promise<void> {
    return super.alertingRequest('delete', `templates/${id}`);
  }
}
