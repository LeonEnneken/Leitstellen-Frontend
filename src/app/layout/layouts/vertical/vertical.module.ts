import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { FuseFullscreenModule } from '@fuse/components/fullscreen';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { RadioCodesModule } from 'app/layout/common/radio-codes/radio-codes.module';
import { SearchModule } from 'app/layout/common/search/search.module';
import { UserModule } from 'app/layout/common/user/user.module';
import { VerticalLayoutComponent } from 'app/layout/layouts/vertical/vertical.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [
    VerticalLayoutComponent
  ],
  imports: [
    HttpClientModule,
    RouterModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    FuseFullscreenModule,
    FuseNavigationModule,
    SearchModule,
    UserModule,
    RadioCodesModule,
    SharedModule
  ],
  exports: [
    VerticalLayoutComponent
  ]
})
export class VerticalLayoutModule {
}
