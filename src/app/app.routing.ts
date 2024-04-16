import { Route } from '@angular/router';
import { InitialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { MaintenanceDataResolver } from './modules/maintenance/maintenance.resolvers';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  }, {
    path: 'auth',
    component: LayoutComponent,
    data: {
      layout: 'empty'
    },
    loadChildren: () => import('app/modules/auth/auth.module').then(m => m.AuthModule)
  }, {
    path: 'setup',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    data: {
      layout: 'empty'
    },
    loadChildren: () => import('app/modules/setup/setup.module').then(m => m.SetupModule)
  }, {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    resolve: {
      initialData: InitialDataResolver,
    },
    loadChildren: () => import('app/modules/dashboard/dashboard.module').then(m => m.DashboardModule)
  }, {
    path: 'maintenance',
    component: LayoutComponent,
    data: {
      layout: 'empty'
    },
    resolve: {
      initialData: MaintenanceDataResolver
    },
    loadChildren: () => import('app/modules/maintenance/maintenance.module').then((m) => m.MaintenanceModule)
  }, {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  }
];
