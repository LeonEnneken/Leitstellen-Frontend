import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { Observable, of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { BackendUser, UserService } from '../services/user.service';

@Injectable()
export class AuthService {

  private _authenticated: boolean = false;

  constructor(private _httpClient: HttpClient, private _userService: UserService) {

  }

  set accessToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  get accessToken(): string {
    return localStorage.getItem('accessToken') ?? '';
  }

  checkTokenExists(): Observable<boolean> {
    if(this.accessToken && this.accessToken.length !== 0)
      return this.signIn();
    return of(false);
  }

  signIn(): Observable<boolean> {
    if (this._authenticated) {
      return throwError('User is already logged in.');
    }

    return this._httpClient.get('/api/auth/refresh_token').pipe(switchMap((response: any) => {
      if(!(response.access_token)) {
        this.signOut();
        return of(false);
      }
      this.accessToken = response.access_token;

      return this._httpClient.get<BackendUser | undefined>('/api/user/me').pipe(switchMap((response) => {
        if(!(response) || response.createdAt == null || response.createdAt == undefined) {
          this.signOut();
          return of(false);
        }
        this._authenticated = true;
        this._userService.user = response;
        return of(true);
      }));
    }));


  }

  signOut(): Observable<any> {
    localStorage.removeItem('accessToken');
    this._authenticated = false;
    return of(true);
  }

  check(): Observable<boolean> {
    if (this._authenticated) {
      return of(true);
    }
    if (!this.accessToken) {
      return of(false);
    }
    if (AuthUtils.isTokenExpired(this.accessToken)) {
      return of(false);
    }
    return of(false);
  }
}
