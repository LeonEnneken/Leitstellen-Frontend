import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { UserService } from 'app/core/services/user.service';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PermissionsAuthGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(private _userService: UserService, private _router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let url: string = state.url;
    return this.checkRole(route, url);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(childRoute, state);
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }
  
  private checkRole(route: ActivatedRouteSnapshot, url: any): Observable<boolean> {
    const selectedBroadcaster = localStorage.getItem('selectedBroadcaster');

    return this._userService.user$.pipe(switchMap((user) => {
      const permissions = user.permissions.find((x) => x.broadcasterId === selectedBroadcaster);

      if(!(permissions)) {
        this._router.navigate(['']);
        return of(false);
      }
      if(route.data.roles && !(route.data.roles.includes(permissions.groupName.toLowerCase()))) {
        this._router.navigate(['']);
        return of(false);
      }
      return of(true);
    }));
  }
}
