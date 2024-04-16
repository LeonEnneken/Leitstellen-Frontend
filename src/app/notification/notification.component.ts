import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BackendUser, BackendUserActiveFileSheet } from 'app/core/services/user.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'notification',
  templateUrl: './notification.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  user: BackendUser;
  items: BackendUserActiveFileSheet[];

  constructor(
    private dialogRef: MatDialogRef<NotificationComponent>, 
    @Inject(MAT_DIALOG_DATA) private _data: { 
      user: BackendUser,
      items: BackendUserActiveFileSheet[] 
    }) {

  }

  ngOnInit(): void {
    this.user = this._data.user;
    this.items = this._data.items;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  close(): void {
    this.dialogRef.close();
  }
}
