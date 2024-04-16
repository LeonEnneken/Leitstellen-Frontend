import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { SettingsService } from './core/services/settings.service';
import { UserService } from './core/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class InitialDataResolver implements Resolve<any> {

  constructor(private _settingsService: SettingsService, private _userService: UserService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin([
      this._settingsService.getSettings(),
      this._userService.get()
    ]);
  }
}
