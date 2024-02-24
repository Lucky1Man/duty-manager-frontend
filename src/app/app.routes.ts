import { Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { ExecutionFactsListComponent } from './execution-facts-list/execution-facts-list.component';

export const routes: Routes = [
    {path: "login", component: AuthenticationComponent},
    {path: "execution-facts", component: ExecutionFactsListComponent}
];
