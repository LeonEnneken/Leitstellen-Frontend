import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { AuditLogResponse, AuditLogsService, BackendAuditLog } from "app/core/services/audit-logs.service";
import { BackendUserSearch } from "app/core/services/user.service";
import { AuditLogType, SharedModule } from "app/shared/shared.module";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'admin-audit-logs',
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminAuditLogsComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject();

  submitted: boolean = false;

  auditLogs: AuditLogResponse;

  types: AuditLogType[] = [];

  selectedUser: BackendUserSearch;
  selectedType: string;

  constructor(
    private _auditLogsService: AuditLogsService,

    private _sharedModule: SharedModule
  ) {

  }

  ngOnInit(): void {
    this.types = this._sharedModule.getAuditLogTypes;

    this.selectedType = this.types[0].value;

    this.loadAuditLogs({ pageIndex: 0, pageSize: 50 });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  loadAuditLogs(event: { pageIndex: number, pageSize: number }) {
    if (this.selectedUser && this.selectedType !== 'EMPTY') {
      this._auditLogsService.getAll(event.pageIndex, event.pageSize, this.selectedUser.id, [this.selectedType]).pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
        this.auditLogs = response;
      });
      return;
    }
    if (this.selectedUser) {
      this._auditLogsService.getAll(event.pageIndex, event.pageSize, this.selectedUser.id).pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
        this.auditLogs = response;
      });
      return;
    }
    if (this.selectedType !== 'EMPTY') {
      this._auditLogsService.getAll(event.pageIndex, event.pageSize, undefined, [this.selectedType]).pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
        this.auditLogs = response;
      });
      return;
    }

    this._auditLogsService.getAll(event.pageIndex, event.pageSize).pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.auditLogs = response;
    });
  }

  selectMember(user: BackendUserSearch) {
    this.selectedUser = user;
  }

  reset() {
    this.selectedUser = undefined;
    this.selectedType = this.types[0].value;
    
    this.loadAuditLogs({ pageIndex: 0, pageSize: this.auditLogs.pagination.per_page });
  }

  search() {
    this.loadAuditLogs({ pageIndex: 0, pageSize: this.auditLogs.pagination.per_page });
  }

  getChanges(item: BackendAuditLog) {
    return [
      JSON.parse(item.changes[0]),
      JSON.parse(item.changes[1])
    ];
  }
}