import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { BackendSettings, SettingsService } from 'app/core/services/settings.service';
import { BackendUser, UserService } from 'app/core/services/user.service';

@Component({
  selector: 'auth-sign-in',
  templateUrl: './sign-in.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AuthSignInComponent implements OnInit {

  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };

  showAlert: boolean = false;

  signedIn: boolean = false;

  settings: BackendSettings;

  private user: BackendUser;

  private redirectURL: string;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private _userService: UserService,
    private _settingsService: SettingsService,
    private _router: Router) {

  }

  ngOnInit(): void {
    this._settingsService.getSettings().subscribe((response) => {
      this.settings = response;
    });

    this._userService.user$.subscribe((user) => {
      this.user = user;
    });

    this.redirectURL = localStorage.getItem('redirectURL');
    localStorage.removeItem('redirectURL');

    const error = this._activatedRoute.snapshot.queryParamMap.get('error');
    const access_token = this._activatedRoute.snapshot.queryParamMap.get('access_token');

    if (error) {
      if(error === 'terminated') {
        this.alert = {
          type: 'error',
          message: 'Du wurdest gekündigt und bist somit nicht berechtigt dich einzuloggen!'
        }
        this.showAlert = true;
        this.signedIn = true;
        return;
      }

      this.alert = {
        type: 'error',
        message: 'Du bist nicht berechtigt dich einzuloggen!'
      }
      this.showAlert = true;
      this.signedIn = true;
      return;
    }

    if (access_token) {
      this.alert = { type: 'success', message: 'Du hast dich erfolgreich eingeloggt!' };
      this.showAlert = true;
      this.signedIn = true;

      this._authService.accessToken = access_token;
      this._authService.signIn().subscribe((response) => {
        if (response)
          this.navigate();
      }, (error) => {
        this.alert = { type: 'error', message: 'Du bist bereits eingeloggt!' };
        this.showAlert = true;
      });
      return;
    }

    this._authService.checkTokenExists().subscribe((response) => {
      if (response)
        this.navigate();
    }, (error) => {
      this.alert = { type: 'error', message: 'Du bist bereits eingeloggt!' };
      this.showAlert = true;
    });
  }

  private navigate() {
    if (!(this.user.details) || this.user.details.id === null || this.user.details.id === undefined) {
      this._router.navigate(['setup']);
      return;
    }

    if (this.redirectURL && this.redirectURL.includes('?')) {
      const url = this.redirectURL.split('?');
      const params = new URLSearchParams(`?${url[1]}`);

      const queryParams: Params = {};

      params.forEach((value, key) => {
        if (key == 'access_token')
          return;
        queryParams[key] = value;
      });

      this._router.navigate([url[0]], {
        queryParams: queryParams
      });
      return;
    }

    this._router.navigate(this.redirectURL ? [this.redirectURL] : ['dashboard']);
  }

  signIn(): void {
    document.location.href = '/api/auth';
  }
}
