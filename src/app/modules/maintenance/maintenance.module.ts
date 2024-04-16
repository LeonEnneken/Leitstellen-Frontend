import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MaintenanceComponent } from './maintenance.component';

const routes: Route[] = [{
  path: '',
  component: MaintenanceComponent
}];

@NgModule({
  declarations: [
    MaintenanceComponent
  ],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class MaintenanceModule {
}
