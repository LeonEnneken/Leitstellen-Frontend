import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { FuseCardModule } from '@fuse/components/card';
import { FuseMasonryModule } from '@fuse/components/masonry';
import { SharedModule } from 'app/shared/shared.module';
import { SearchMemberModule } from '../search-member/search-member.module';
import { SearchVehicleModule } from '../search-vehicle/search-vehicle.module';
import { ControlCenterSheetComponent } from './control-center-sheet.component';
import { ControlCenterSheetDetailsComponent } from './details/details.component';

@NgModule({
  declarations: [
    ControlCenterSheetComponent,
    ControlCenterSheetDetailsComponent,
  ],
  imports: [
    RouterModule,
    OverlayModule,
    PortalModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatRippleModule,
    MatTableModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatDialogModule,
    FuseCardModule,
    FuseMasonryModule,
    SearchMemberModule,
    SearchVehicleModule,
    SharedModule
  ],
  exports: [
    ControlCenterSheetComponent,
    ControlCenterSheetDetailsComponent
  ]
})
export class ControlCenterSheetModule {
}
