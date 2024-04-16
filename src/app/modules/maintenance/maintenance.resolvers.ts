import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { SettingsService } from 'app/core/services/settings.service';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceDataResolver implements Resolve<any> {

  constructor(private _settingsService: SettingsService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin([
      this._settingsService.getSettings()
    ]);
  }
}
