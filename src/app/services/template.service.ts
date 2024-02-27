import { Injectable } from '@angular/core';
import { Template } from '../../shared/template';
import { Subject, Subscription } from 'rxjs';
import { AxiosService } from './axios.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgEventBus } from 'ng-event-bus';
import { AxiosError } from 'axios';
import { Events } from '../../shared/duty-manager-events';

type NewTemplatesCallback = (facts: Template[]) => void;

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  private templatesSubject = new Subject<Template[]>();

  constructor(
    private axios: AxiosService,
    private snackBar: MatSnackBar,
    eventBus: NgEventBus
  ) {
    eventBus.on(Events.LOGGED_IN).subscribe(() => this.fetchTemplates());
  }

  subscribeToNewTemplates(callback: NewTemplatesCallback): Subscription {
    return this.templatesSubject.asObservable().subscribe(callback);
  }

  fetchTemplates() {
    this.axios
      .request('get', 'duties')
      .then((returnedDuties) => {
        this.templatesSubject.next(returnedDuties.data);
      })
      .catch((error: AxiosError<any, any>) => this.alertUser(error));
  }

  private alertUser(error: AxiosError<any, any>) {
    this.snackBar.open(
      error.response?.data.message ?? error.message,
      undefined,
      {
        duration: 10000,
      }
    );
  }
}
