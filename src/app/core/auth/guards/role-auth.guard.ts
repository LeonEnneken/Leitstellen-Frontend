import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { UserService } from 'app/core/services/user.service';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleAuthGuard implements CanActivate, CanActivateChild, CanLoad {

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
    return this._userService.user$.pipe(switchMap((user) => {
      const { role } = user;

      if(route.data.role && route.data.role.indexOf(role) === -1) {
        this._router.navigate(['']);
        return of(false);
      }
      return of(true);
    }));
  }
}
