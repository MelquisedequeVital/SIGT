import { Routes } from '@angular/router';
import { DashboardTccComponent } from './components/dashboard-tcc/dashboard-tcc.component';
import { TccRegistrationComponent } from './components/tcc-registration/tcc-registration.component';
import { LoginComponent } from './components/login/login';

export const routes: Routes = [
  { path: '', redirectTo: 'agenda-tcc', pathMatch: 'full' },
  {
    path: 'agenda-tcc',
    component: DashboardTccComponent,
    title: 'SIGT - Sistema Gerenciador de TCC',
  },
  { path: 'cadastro', component: TccRegistrationComponent, title: 'SIGT | Cadastrar TCC' },
  { path: 'cadastro-tcc', component: TccRegistrationComponent, title: 'SIGT | Cadastrar TCC' },
  { path: 'login', component: LoginComponent, title: 'SIGT | Login' },
];
