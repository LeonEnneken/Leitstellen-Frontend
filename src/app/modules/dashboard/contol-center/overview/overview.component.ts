import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { BackendControlCenterMember, ControlCentersService } from 'app/core/services/control-centers.service';
import { BackendGroup, GroupsService } from 'app/core/services/groups.service';
import { BackendRadioCode, RadioCodesService } from 'app/core/services/radio-codes.service';
import { BackendSettings, SettingsService } from 'app/core/services/settings.service';
import { UserService } from 'app/core/services/user.service';
import { ControlCenterSheetDetailsComponent } from 'app/layout/common/control-center-sheet/details/details.component';
import { cloneDeep } from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'control-center-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ControlCenterOverviewComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject();

  private groups: BackendGroup[] = [];

  onDuty: BackendControlCenterMember[] = [];
  offDuty: BackendControlCenterMember[] = [];
  awayFromKeyboard: BackendControlCenterMember[] = [];

  radioCodes: BackendRadioCode[] = [];

  settings: BackendSettings;

  constructor(
    private _controlCentersService: ControlCentersService,
    private _groupsService: GroupsService,
    private _radioCodesService: RadioCodesService,
    private _userService: UserService,
    private _settingsService: SettingsService,

    private _matDialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    this._controlCentersService.getDetailsByStatus('ON_DUTY').pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.onDuty = response;
    });
    this._controlCentersService.getDetailsByStatus('OFF_DUTY').pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.offDuty = response;
    });
    this._controlCentersService.getDetailsByStatus('AWAY_FROM_KEYBOARD').pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.awayFromKeyboard = response;
    });

    this._controlCentersService.onDuty.pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.onDuty = response;
    });

    this._controlCentersService.offDuty.pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.offDuty = response;
    });

    this._controlCentersService.awayFromKeyboard.pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.awayFromKeyboard = response;
    });

    this._groupsService.get.pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.groups = response;
    });

    this._radioCodesService.get.pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.radioCodes = response;
    });

    this._settingsService.get.pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.settings = response;
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  hasPermissions(permissions: string) {
    return this._userService.hasPermissions(permissions);
  }

  getGroup(member: BackendControlCenterMember) {
    const group = this.groups.find((x) => x.id === member.groupId);

    if(!(group)) {
      return 'Nicht bekannt..';
    }
    return `${group.uniqueId}. ${group.name}`;
  }

  getRadioCodeStyle(radioCode: BackendRadioCode) {
    return {
      'bg-blue-200 text-blue-800 dark:bg-blue-600 dark:text-blue-50': radioCode.type === 'INFO',
      'bg-accent-200 text-accent-800 dark:bg-accent-600 dark:text-accent-50': radioCode.type === 'NORMAL',
      'bg-red-200 text-red-800 dark:bg-red-600 dark:text-red-50': radioCode.type === 'WARN'
    };
  }

  openDialog(member: BackendControlCenterMember) {
    this._matDialog.open(ControlCenterSheetDetailsComponent, {
      autoFocus: false,
      data: {
        member: cloneDeep(member)
      }
    });
  }
}
