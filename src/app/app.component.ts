import { DOCUMENT, registerLocaleData } from '@angular/common';
import localeDE from '@angular/common/locales/de';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { BackendSettings, SettingsService } from './core/services/settings.service';
import { BackendUser, UserService } from './core/services/user.service';
import { NotificationComponent } from './notification/notification.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private settings: BackendSettings;

  private user: BackendUser;

  private aprilFool = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,

    private _settingsService: SettingsService,
    private _userService: UserService,
    private _matDialog: MatDialog,
    private _router: Router,
    private _title: Title
  ) {

  }

  ngOnInit(): void {

    if (this.aprilFool) {
      this.initAprilFool();
    }

    registerLocaleData(localeDE, 'de');

    this._settingsService.getSettings().subscribe((response) => {
      if (!(response)) {
        return;
      }
      if(response.maintenance) {
        this._router.navigate(['maintenance']);
      }

      if(!this.settings && response) {
        const script = document.createElement('script');
        script.async = true;
        script.defer = true;
        script.dataset.domain = window.location.host;
        script.src = 'https://analytics.es-intern.de/js/script.js';
        document.head.appendChild(script);
      }
      this.settings = response;

      this._title.setTitle(`Grand-Roleplay.de :: ${response.organisationName} Webinterface`);
    });

    this._userService.user$.subscribe((user) => {
      if (!(user)) {
        return;
      }
      if (this.user) {
        return;
      }
      this.user = user;

      this._userService.getActiveFileSheets().subscribe((response) => {
        if (response.length === 0) {
          return;
        }
        this._matDialog.open(NotificationComponent, {
          autoFocus: true,
          data: {
            user: cloneDeep(this.user),
            items: cloneDeep(response)
          }
        });
      });
    });

    window.onfocus = () => {
      if (this.settings) {
        this._title.setTitle(`Grand-Roleplay.de :: ${this.settings.organisationName} Webinterface`);
      } else {
        this._title.setTitle('Grand-Roleplay.de :: Webinterface');
      }
    };

    window.onblur = () => {
      this._title.setTitle('Wir vermissen dich 😥');
    };
  }

  private initAprilFool() {
    const randomInt = (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min + 1) + min);
    };

    setTimeout(async () => {
      const timer = (ms: number) => new Promise(res => setTimeout(res, ms));

      this.document.documentElement.style.filter = 'invert(1)';
      this.document.body.style.overflow = 'hidden';

      for (let i = 0; i !== 360; i++) {
        this.document.body.style.transform = `rotate(${i}deg)`;
        await timer(1);
      }
      this.document.body.style.transform = 'unset';
      this.document.body.style.overflow = 'unset';
      this.document.documentElement.style.filter = 'unset';
    }, 1000 * randomInt(5, 15));
  }
}
