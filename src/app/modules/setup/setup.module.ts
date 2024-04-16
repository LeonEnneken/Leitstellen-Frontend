import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Route, RouterModule } from '@angular/router';
import { FuseCardModule } from '@fuse/components/card';
import { SharedModule } from 'app/shared/shared.module';

import { SetupMainComponent } from './main/main.component';

const routes: Route[] = [
  {
    path: '',
    component: SetupMainComponent
  }
];

@NgModule({
  declarations: [
    SetupMainComponent,
  ],
  imports: [
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    FuseCardModule,
    SharedModule,
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class SetupModule {

}
