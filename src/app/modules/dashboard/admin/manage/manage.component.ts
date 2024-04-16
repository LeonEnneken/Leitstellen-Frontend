import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { AdminService, BackendAdmin } from "app/core/services/admin.service";
import { BackendUser, BackendUserSearch, UserService } from "app/core/services/user.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'admin-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AdminManageComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject();

  users: BackendAdmin[];

  user: BackendUser;

  constructor(
    private _adminService: AdminService,
    private _userService: UserService,

    private _fuseConfirmationService: FuseConfirmationService
  ) {

  }

  ngOnInit(): void {
    this.load();

    this._userService.user$.subscribe((response) => {
      this.user = response;
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  isAdmin() {
    if(!(this.user))
      return false;
    return this.user.role === 'ADMINISTRATOR';
  }

  hasPermissions(permission: string) {
    return this._userService.hasPermissions(permission);
  }

  selectMember(member: BackendUserSearch) {
    if(!(this.isAdmin()))
      return;

    const confirmation = this._fuseConfirmationService.open({
      title: 'Administrator einstellen?',
      message: 'Willst du diesen Administrator wirklich einstellen?',
      actions: {
        confirm: {
          label: 'Ja, einstellen!'
        },
        cancel: {
          label: 'Nein, abbrechen!'
        }
      }
    });

    confirmation.afterClosed().subscribe((result) => {
      if(result !== 'confirmed')
        return;
      this._adminService.addAdmin(member.id).pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
        this.load();
      }, (error) => {
        console.error(error);
      });
    });
  }

  removeAdmin(user: BackendAdmin) {
    if(!(this.isAdmin()))
      return;

    const confirmation = this._fuseConfirmationService.open({
      title: 'Administrator löschen?',
      message: 'Willst du diesen Administrator wirklich löschen?',
      actions: {
        confirm: {
          label: 'Ja, löschen!'
        },
        cancel: {
          label: 'Nein, abbrechen!'
        }
      }
    });

    confirmation.afterClosed().subscribe((result) => {
      if(result !== 'confirmed')
        return;
      this._adminService.removeAdmin(user.id).pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
        this.load();
      }, (error) => {
        console.error(error);
      });
    });
  }

  private load() {
    this._adminService.getList().pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.users = response;
    });
  }


}