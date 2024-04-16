import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { RadioCodesComponent } from './radio-codes.component';

@NgModule({
  declarations: [
    RadioCodesComponent
  ],
  imports: [
    RouterModule,
    OverlayModule,
    PortalModule,
    MatButtonModule,
    MatIconModule,
    SharedModule
  ],
  exports: [
    RadioCodesComponent
  ]
})
export class RadioCodesModule {
}
