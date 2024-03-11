import { Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { ExecutionFactsComponent } from './execution-facts/execution-facts.component';
import { ParticipantsComponent } from './participants/participants.component';
import { TemplatesComponent } from './templates/templates.component';

export const routes: Routes = [
    {path: "login", component: AuthenticationComponent},
    {path: "execution-facts", component: ExecutionFactsComponent},
    {path: "templates", component: TemplatesComponent},
    {path: "", component: ParticipantsComponent}
];
