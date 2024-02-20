import { HttpClientModule } from '@angular/common/http';
import { Component, Injector } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AxiosService } from './axios.service';
import { LoginFormComponent } from './login-form/login-form.component';
import { HeaderComponent } from './header/header.component';
import { AxiosError } from 'axios';
import { NgEventBus } from 'ng-event-bus';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Participant } from '../shared/participant';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HttpClientModule,
    LoginFormComponent,
    HeaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [NgEventBus, AxiosService, MatDialog],
})
export class AppComponent {
  constructor(
    private axios: AxiosService,
    private router: Router,
    private eventBus: NgEventBus,
    snackBar: MatSnackBar
  ) {
    eventBus.on('doLogin').subscribe((login) => this.signIn(login.data));
    eventBus.on('logout').subscribe(() => {
      snackBar.open('You were logged out.', undefined, { duration: 2000 });
      axios.setAuthToken(null);
      router.navigate(['']);
      eventBus.cast('authChange');
    });
  }

  getData() {
    this.axios
      .request('get', 'duties')
      .then((duties) => console.log(duties))
      .catch((error) => {return});
  }

  private signIn(credentials: any) {
    this.axios
      .request('post', 'auth/jwt', {
        email: credentials.login,
        password: credentials.password,
      })
      .then((response) => {
        let data = response.data as Participant;
        if (data) {
          this.axios.setAuthToken(data);
        }
        this.router.navigate(['']);
      })
      .catch((errResponse) => {
        this.axios.setAuthToken(null);
      })
      .finally(() => this.eventBus.cast('authChange'));
  }
}
