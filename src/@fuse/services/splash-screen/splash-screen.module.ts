import { NgModule } from '@angular/core';
import { FuseSplashScreenService } from '@fuse/services/splash-screen/splash-screen.service';

@NgModule({
  providers: [
    FuseSplashScreenService
  ]
})
export class FuseSplashScreenModule {

  constructor(private _fuseSplashScreenService: FuseSplashScreenService) {

  }
}
