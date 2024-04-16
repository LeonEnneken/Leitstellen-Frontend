import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { BackendControlCenter, BackendControlCenterDetails, ControlCenterMember, ControlCentersService } from 'app/core/services/control-centers.service';
import { BackendSettings, SettingsService } from 'app/core/services/settings.service';
import { BackendUser, BackendUserSearch, UserService } from 'app/core/services/user.service';
import { BackendVehicle, VehiclesService } from 'app/core/services/vehicles.service';
import { WebsocketService } from 'app/core/services/websocket.service';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ControlCenterSheetDetailsComponent } from './details/details.component';

export interface ControlCenterItem {
  title: string;
  value: string;
}

@Component({
  selector: 'control-center-sheet',
  templateUrl: './control-center-sheet.component.html',
  styleUrls: ['./control-center-sheet.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ControlCenterSheetComponent implements OnInit, OnDestroy {

  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;

  masonryColumns: number = 4;

  filter$: BehaviorSubject<string> = new BehaviorSubject('ALL');

  @Input() private types: String[] = [];

  @Input() sidebarLabels: ControlCenterItem[] = [{
    title: 'Leere Ausblenden',
    value: 'EMPTY'
  }];

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  settings: BackendSettings;

  vehicles: BackendVehicle[] = [];

  controlCenters: BackendControlCenter[] = [];

  controlCenterDetails: BackendControlCenterDetails[] = [];

  selectedUser: BackendUserSearch;

  selectedControlCenter: string;

  user: BackendUser;

  submitted: boolean = false;

  constructor(
    private _controlCentersService: ControlCentersService,
    private _vehiclesService: VehiclesService,
    private _userService: UserService,
    private _settingsService: SettingsService,

    private watcherService: FuseMediaWatcherService,
    private changeDetectorRef: ChangeDetectorRef,
    private webSocketService: WebsocketService,
    private matDialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    this._settingsService.get.pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.settings = response;
    });

    this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.user = response;
    });

    this._controlCentersService.get.pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      if (this.types.length === 0) {
        this.controlCenters = response.filter((x) => x.type !== 'AFK');
        return;
      }
      this.controlCenters = response.filter((x) => this.types.includes(x.type.toUpperCase()) && x.type !== 'AFK');
    });

    this._vehiclesService.get.pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.vehicles = response;
    });

    this._controlCentersService.details.pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.controlCenterDetails = response;
    });

    this.watcherService.onMediaChange$.pipe(takeUntil(this._unsubscribeAll)).subscribe(({ matchingAliases }) => {
      if (matchingAliases.includes('lg')) {
        this.drawerMode = 'side';
        this.drawerOpened = true;
      } else {
        this.drawerMode = 'over';
        this.drawerOpened = false;
      }

      if (matchingAliases.includes('xl')) {
        this.masonryColumns = 4;
      }
      else if (matchingAliases.includes('lg')) {
        this.masonryColumns = 3;
      }
      else if (matchingAliases.includes('md')) {
        this.masonryColumns = 2;
      }
      else if (matchingAliases.includes('sm')) {
        this.masonryColumns = 1;
      } else {
        this.masonryColumns = 1;
      }

      this.changeDetectorRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  hasPermissions(permissions: string) {
    return this._userService.hasPermissions(permissions);
  }

  getControlCenters() {
    if (this.filterStatus === 'ALL') {
      return this.controlCenters;
    }
    if (this.filterStatus === 'EMPTY') {
      const items = [];

      for (const item of this.controlCenters) {
        const details = this.controlCenterDetails.find((x) => x.id === item.id);

        if (details && details.members?.length !== 0) {
          items.push(item);
        }
      }
      return items;
    }
    return this.controlCenters.filter((x) => x.type === this.filterStatus);
  }

  getDetails(id: string) {
    return this.controlCenterDetails.find((x) => x.id === id);
  }

  get filterStatus(): string {
    return this.filter$.value;
  }

  resetFilter() {
    this.filter$.next('ALL');
  }

  filterByLabel(filter: string) {
    this.filter$.next(filter);
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  addSelf(controlCenterId: string) {
    if (!(this.user)) {
      return;
    }
    if (this.user.status !== 'ON_DUTY') {
      return;
    }
    this.submitted = true;

    this._controlCentersService.addUser(controlCenterId, this.user.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.webSocketService.sendEvent('request-details');

      setTimeout(() => {
        this.submitted = false;
      }, 1000);
    });
  }

  addUser() {
    if (!(this.selectedUser) || !(this.selectedControlCenter)) {
      return;
    }
    this.submitted = true;

    this._controlCentersService.addUser(this.selectedControlCenter, this.selectedUser.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.webSocketService.sendEvent('request-details');

      setTimeout(() => {
        this.submitted = false;
      }, 1000);
    });
  }

  removeUser(controlCenterId: string, userId: string) {
    this._controlCentersService.removeUser(controlCenterId, userId).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.webSocketService.sendEvent('request-details');
    });
  }

  selectMember(user: BackendUserSearch) {
    this.selectedUser = user;
  }

  getStatus(id: string) {
    const status = this.controlCenterDetails.find((x) => x.id === id)?.status ?? 'NOT_OCCUPIED';
    return this.settings.controlCenterStatus.find((x) => x.value === status)?.label ?? 'Unbekannt';
  }

  getStatusStyle(id: string) {
    const status = this.controlCenterDetails.find((x) => x.id === id)?.status ?? 'NOT_OCCUPIED';

    const item = this.settings.controlCenterStatus.find((x) => x.value === status.toUpperCase());

    if(!(item)) {
      return {
        'bg-red-200 text-red-800 dark:bg-red-600 dark:text-red-50': true
      };
    }
    const style: any = {};

    style[`bg-${item.color.toLowerCase()}-200`] = true;
    style[`text-${item.color.toLowerCase()}-800`] = true;
    style[`dark:bg-${item.color.toLowerCase()}-600`] = true;
    style[`dark:text-${item.color.toLowerCase()}-50`] = true;

    return style;
  }

  updateStatus(id: string, status: string) {
    if (!(this.hasPermissions('CONTROL_CENTERS_MANAGE'))) {
      return;
    }
    this._controlCentersService.patchStatus(id, status).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.webSocketService.sendEvent('request-details');
    });
  }

  selectVehicle(id: string, vehicle: BackendVehicle) {
    if (!(this.hasPermissions('CONTROL_CENTERS_MANAGE'))) {
      return;
    }
    this._controlCentersService.patchVehicle(id, vehicle.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.webSocketService.sendEvent('request-details');
    });
  }

  getVehicle(id: string) {
    if (!(id) || id.trim().length === 0) {
      return 'Kennzeichen';
    }
    const details = this.controlCenterDetails.find((x) => x.id === id);

    if (!(details)) {
      return 'Kennzeichen';
    }
    const vehicle = this.vehicles.find((x) => x.id === details.vehicle);

    if (!(vehicle)) {
      return 'Kennzeichen';
    }
    return `${vehicle.licensePlate}`;
  }

  removeVehicle(id: string) {
    if (!(this.hasPermissions('CONTROL_CENTER_MANAGE'))) {
      return;
    }
    this._controlCentersService.deleteVehicle(id).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.webSocketService.sendEvent('request-details');
    });
  }

  openMemberDialog(member: ControlCenterMember) {
    this.matDialog.open(ControlCenterSheetDetailsComponent, {
      autoFocus: false,
      data: {
        member: cloneDeep(member)
      }
    });
  }

}
