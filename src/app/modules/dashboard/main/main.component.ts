import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { AuditLogResponse, AuditLogsService } from 'app/core/services/audit-logs.service';
import { BackendUser, UserService } from 'app/core/services/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MainComponent implements OnInit {

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  detailsFlashMessage: 'success' | 'error' | null = null;

  user: BackendUser | undefined;

  hiredTerminated: AuditLogResponse;

  groupsDepartments: AuditLogResponse;

  constructor(
    private _auditLogsService: AuditLogsService,
    private _userService: UserService
  ) {

  }

  ngOnInit(): void {
    this._userService.user$.subscribe((response) => {
      this.user = response;
    });

    this.loadHiredTerminatedLogs({ pageIndex: 0, pageSize: 25 });
    this.loadGroupsDepartmentsLogs({ pageIndex: 0, pageSize: 25 });
  }

  hasPermissions(permission: string) {
    return this._userService.hasPermissions(permission);
  }

  loadHiredTerminatedLogs(event: { pageIndex: number, pageSize: number }) {
    if (!(this.hasPermissions('AUDIT_LOGS_SHOW')))
      return;
    this._auditLogsService.getHiredAndTerminated(event.pageIndex, event.pageSize).pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.hiredTerminated = response;
    });
  }

  loadGroupsDepartmentsLogs(event: { pageIndex: number, pageSize: number }) {
    if (!(this.hasPermissions('AUDIT_LOGS_SHOW')))
      return;
    this._auditLogsService.getGroupDepartmentPatched(event.pageIndex, event.pageSize).pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.groupsDepartments = response;
    });
  }

  /*
  ngOnInit(): void {
    this.groupsService.getGroups.subscribe((groups) => this.groups = groups);
    this.statisticsService.getGroups().subscribe((groups) => this.groupStatistics = groups);

    this.userService.user$.subscribe((user) => {
      this.user = user;
    });

    this.loadEnterExit({ pageIndex: 0, pageSize: 25 });
    this.loadRanks({ pageIndex: 0, pageSize: 25 });
  }


  getGroup(groupId: string) {
    return this.groups.find((x) => x.id === groupId);
  }

  getFirstGroup() {
    if (this.groupStatistics.length == 0)
      return 0;
    let count = 0;
    this.groupStatistics.filter((x) => x.uniqueId >= 1 && x.uniqueId <= 15).forEach((item) => count += item.userCount);
    return count;
  }

  getSecondGroup() {
    if (this.groupStatistics.length == 0)
      return 0;
    let count = 0;
    this.groupStatistics.filter((x) => x.uniqueId >= 16 && x.uniqueId <= 21).forEach((item) => count += item.userCount);
    return count;
  }

  getThirdGroup() {
    if (this.groupStatistics.length == 0)
      return 0;
    let count = 0;
    this.groupStatistics.filter((x) => x.uniqueId >= 22 && x.uniqueId <= 25).forEach((item) => count += item.userCount);
    return count;
  }

  getFourthGroup() {
    if (this.groupStatistics.length == 0)
      return 0;
    let count = 0;
    this.groupStatistics.filter((x) => x.uniqueId >= 26 && x.uniqueId <= 27).forEach((item) => count += item.userCount);
    return count;
  }

  getFifthGroup() {
    if (this.groupStatistics.length == 0)
      return 0;
    let count = 0;
    this.groupStatistics.filter((x) => x.uniqueId >= 28 && x.uniqueId <= 30).forEach((item) => count += item.userCount);
    return count;
  }*/
}
