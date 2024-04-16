import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Route, RouterModule } from '@angular/router';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseCardModule } from '@fuse/components/card';
import { SharedModule } from 'app/shared/shared.module';

import { MatDividerModule } from '@angular/material/divider';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { AuthDataResolver } from './auth.resolvers';
import { AuthSignInComponent } from './sign-in/sign-in.component';
import { AuthSignOutComponent } from './sign-out/sign-out.component';
import { AuthSignedUpComponent } from './signed-up/signed-up.component';

const routes: Route[] = [{
  path: 'sign-in',
  component: AuthSignInComponent,
  canActivate: [NoAuthGuard],
  canActivateChild: [NoAuthGuard],
  resolve: {
    initialData: AuthDataResolver,
  }
}, {
  path: 'signed-up',
  component: AuthSignedUpComponent,
  canActivate: [NoAuthGuard],
  canActivateChild: [NoAuthGuard],
  resolve: {
    initialData: AuthDataResolver,
  }
}, {
  path: 'sign-out',
  component: AuthSignOutComponent,
  canActivate: [AuthGuard],
  canActivateChild: [AuthGuard],
  resolve: {
    initialData: AuthDataResolver,
  }
}];

@NgModule({
  declarations: [
    AuthSignInComponent,
    AuthSignOutComponent,
    AuthSignedUpComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    MatButtonModule,
    MatDividerModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FuseCardModule,
    FuseAlertModule,
    SharedModule
  ]
})
export class AuthModule {

}
