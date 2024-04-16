import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { AdminService, BackendConnectedUser } from 'app/core/services/admin.service';
import { BackendGroup, GroupsService } from 'app/core/services/groups.service';
import * as moment from 'moment';
import 'moment/locale/de';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-connections',
  templateUrl: './connections.component.html',
  styleUrls: ['./connections.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AdminConnectionsComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject();

  groups: BackendGroup[];

  users: BackendConnectedUser[];

  constructor(
    private _adminService: AdminService,
    private _groupsService: GroupsService
  ) {

  }

  ngOnInit(): void {
    moment.locale('de');

    this._groupsService.get.pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.groups = response;
    });

    this._adminService.getConnectedUsers().pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.users = response;
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  getStatusStyle(user: BackendConnectedUser) {
    return {
      'bg-green-500': user?.user?.status === 'ON_DUTY',
      'bg-amber-500': user?.user?.status === 'OFF_DUTY',
      'bg-red-500': user?.user?.status === 'OFFLINE'
    };
  }

  getGroup(user: BackendConnectedUser) {
    const group = this.groups.find((x) => x.id === user.user.groupId);

    if(!(group))
      {return 'Nicht gefunden..';}
    return `${group.uniqueId}. ${group.name}`;
  }

  getTimeSince(user: BackendConnectedUser) {
    return moment(user.createdAt).fromNow();
  }

}
