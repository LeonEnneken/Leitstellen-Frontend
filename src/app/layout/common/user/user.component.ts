import { BooleanInput } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BackendUser, UserService } from 'app/core/services/user.service';

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
  exportAs: 'user'
})
export class UserComponent implements OnInit {

  static ngAcceptInputType_showAvatar: BooleanInput;

  @Input() showAvatar: boolean = true;

  user: BackendUser;

  constructor(private _router: Router, private userService: UserService) {

  }

  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  hasPermission(permission: string) {
    return this.userService.hasPermissions(permission);
  }

  signOut(): void {
    this._router.navigate(['auth/sign-out'], {

    });
  }

  updateUserStatus(status: 'ON_DUTY' | 'OFF_DUTY' | 'AWAY_FROM_KEYBOARD' | 'OFFLINE') {
    this.userService.updateStatus(status);
  }

  getStatusStyle() {
    return {
      'mr-px mb-px': !(this.showAvatar) || !(this.user?.account?.avatar),
      'bg-green-500': this.user?.status === 'ON_DUTY',
      'bg-amber-500': this.user?.status === 'OFF_DUTY',
      'bg-red-500': this.user?.status === 'AWAY_FROM_KEYBOARD',
      'bg-gray-400': this.user?.status === 'OFFLINE'
    };
  }
}
