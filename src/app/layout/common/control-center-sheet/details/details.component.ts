import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ControlCenterMember } from 'app/core/services/control-centers.service';
import { BackendDepartment, DepartmentsService } from 'app/core/services/departments.service';
import { BackendGroup, GroupsService } from 'app/core/services/groups.service';
import { UserService } from 'app/core/services/user.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'control-center-sheet-details',
  templateUrl: './details.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ControlCenterSheetDetailsComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  private groups: BackendGroup[] = [];
  private departments: BackendDepartment[] = [];

  member: ControlCenterMember;

  constructor(
    private groupsService: GroupsService,
    private departmentsService: DepartmentsService,
    private userService: UserService,
    private dialogRef: MatDialogRef<ControlCenterSheetDetailsComponent>,

    @Inject(MAT_DIALOG_DATA) private _data: { member: any }
  ) {
  }

  ngOnInit(): void {
    this.groupsService.get.subscribe((response) => {
      this.groups = response;
    });
    this.departmentsService.get.subscribe((response) => {
      this.departments = response;
    });

    this.member = this._data.member;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  hasPermissions(permission: string) {
    return this.userService.hasPermissions(permission);
  }

  getName() {
    if (!(this.member)) {
      return 'Mitglied nicht gefunden..';
    }
    return `${this.member?.firstName} ${this.member?.lastName} (ID: ${this.member?.userId})`;
  }

  getGroup() {
    if (!(this.member)) {
      return 'Rang nicht gefunden..';
    }
    const group = this.groups.find((x) => x.id === this.member?.groupId);

    if(!(group)) {
      return 'Rang nicht gefunden..';
    }
    return `${group?.uniqueId}. ${group?.name}`;
  }

  getDepartment(id: string) {
    if (!(this.member)) {
      return 'Abteilung nicht gefunden..';
    }
    const department = this.departments.find((x) => this.member?.departmentIds.includes(id))?.name;

    if (!(department)) {
      return 'Abteilung nicht gefunden..';
    }
    return department;
  }

  patchStatus() {
    this.userService.updateStatusOther(this.member.id, 'OFFLINE').subscribe(() => {
      this.dialogRef.close();
    });
  }
}
