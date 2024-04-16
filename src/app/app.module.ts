import { LOCALE_ID, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { FuseModule } from '@fuse';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseConfigModule } from '@fuse/services/config';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { appConfig } from 'app/core/config/app.config';
import { CoreModule } from 'app/core/core.module';
import { LayoutModule } from 'app/layout/layout.module';
import { MarkdownModule } from 'ngx-markdown';
import { NotificationComponent } from './notification/notification.component';

const routerConfig: ExtraOptions = {
  preloadingStrategy: PreloadAllModules,
  scrollPositionRestoration: 'enabled'
};

@NgModule({
  declarations: [
    AppComponent,
    NotificationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes, routerConfig),

    // Fuse, FuseConfig & FuseMockAPI
    FuseModule,
    FuseConfigModule.forRoot(appConfig),

    // Core module of your application
    CoreModule,

    // Layout module of your application
    LayoutModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    FuseAlertModule,

    // 3rd party modules that require global configuration via forRoot
    MarkdownModule.forRoot({})
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    Title,
    {
      provide: LOCALE_ID,
      useValue: 'de'
    }
  ]
})
export class AppModule {
}
