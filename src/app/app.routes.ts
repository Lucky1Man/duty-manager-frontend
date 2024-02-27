import { Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { ExecutionFactsComponent } from './execution-facts/execution-facts.component';

export const routes: Routes = [
    {path: "login", component: AuthenticationComponent},
    {path: "execution-facts", component: ExecutionFactsComponent}
];
