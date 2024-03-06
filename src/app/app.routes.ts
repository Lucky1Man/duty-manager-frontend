import { Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { ExecutionFactsComponent } from './execution-facts/execution-facts.component';
import { ParticipantsComponent } from './participants/participants.component';

export const routes: Routes = [
    {path: "login", component: AuthenticationComponent},
    {path: "execution-facts", component: ExecutionFactsComponent},
    {path: "", component: ParticipantsComponent}
];
