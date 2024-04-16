import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from '../core.entity';

@Injectable({
  providedIn: 'root'
})
export class AuditLogsService {

  constructor(private http: HttpClient) {

  }

  getAll(page: number, perPage: number, userId?: string, types?: AuditLogTypeStrings[] | string[]) {
    if (userId && types) {
      return this.http.get<AuditLogResponse>(`/api/audit-log?page=${page}&per_page=${perPage}&userId=${userId}&types=${types.join('&types=')}`);
    }
    if (userId) {
      return this.http.get<AuditLogResponse>(`/api/audit-log?page=${page}&per_page=${perPage}&userId=${userId}`);
    }
    if (types) {
      return this.http.get<AuditLogResponse>(`/api/audit-log?page=${page}&per_page=${perPage}&types=${types.join('&types=')}`);
    }
    return this.http.get<AuditLogResponse>(`/api/audit-log?page=${page}&per_page=${perPage}`);
  }

  getByUserId(page: number, perPage: number, userId: string) {
    return this.http.get<AuditLogResponse>(`/api/audit-log/user?page=${page}&per_page=${perPage}&userId=${userId}`);
  }

  getByTypes(page: number, perPage: number, types: AuditLogTypeStrings[] | string[]) {
    return this.http.get<AuditLogResponse>(`/api/audit-log/type?page=${page}&per_page=${perPage}&types=${types.join('&types=')}`);
  }

  getHiredAndTerminated(page: number, perPage: number) {
    return this.http.get<AuditLogResponse>(`/api/audit-log/hired-and-terminated?page=${page}&per_page=${perPage}`);
  }

  getGroupDepartmentPatched(page: number, perPage: number) {
    return this.http.get<AuditLogResponse>(`/api/audit-log/group-department-patched?page=${page}&per_page=${perPage}`);
  }
}


export enum AuditLogType {
  CONTROL_CENTER_CREATED,
  CONTROL_CENTER_PATCHED,
  CONTROL_CENTER_PATCHED_STATUS,
  CONTROL_CENTER_PATCHED_VEHICLE,
  CONTROL_CENTER_DELETED,

  CONTROL_CENTER_MEMBER_ADDED,
  CONTROL_CENTER_MEMBER_REMOVED,

  DEPARTMENT_CREATED,
  DEPARTMENT_PATCHED,
  DEPARTMENT_DELETED,

  GROUP_CREATED,
  GROUP_PATCHED,
  GROUP_DELETED,

  MEMBER_PATCHED,
  MEMBER_HIRED,
  MEMBER_TERMINATED,

  MEMBER_PROMOTED,
  MEMBER_DEMOTED,

  MEMBER_DEPARTMENT_PATCHED,

  RADIO_CODE_CREATED,
  RADIO_CODE_PATCHED,
  RADIO_CODE_DELETED,

  SETTINGS_PATCHED,

  SETTINGS_HEADER_DETAILS_CREATED,
  SETTINGS_HEADER_DETAILS_PATCHED,
  SETTINGS_HEADER_DETAILS_DELETED,

  VEHICLE_CREATED,
  VEHICLE_PATCHED,
  VEHICLE_DELETED,

  USER_PATCHED,
  USER_PATCHED_OTHER,

  USER_STATUS,
  USER_STATUS_OTHER,
}

export type AuditLogTypeStrings = keyof typeof AuditLogType;

export interface BackendAuditLogUser {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface BackendAuditLog {
  id: string;
  senderId: string;
  sender: BackendAuditLogUser;
  targetId?: string;
  target?: BackendAuditLogUser;
  type: AuditLogType;
  description: string;
  changes: string[];
  createdAt: Date;
}

export interface AuditLogResponse {
  pagination: Pagination;
  data: BackendAuditLog[];
}
