import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private _http: HttpClient) {

  }

  addAdmin(userId: string) {
    return this._http.post<BackendAdmin>(`/api/admin/${userId}`, undefined);
  }

  removeAdmin(userId: string) {
    return this._http.delete<BackendAdmin>(`/api/admin/${userId}`);
  }

  getConnectedUsers() {
    return this._http.get<BackendConnectedUser[]>('/api/admin/connections');
  }

  getList() {
    return this._http.get<BackendAdmin[]>('/api/admin/list');
  }
}
export interface BackendAdminDetails {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface BackendAdmin {
  id: string;
  details: BackendAdminDetails;
  updatedAt: Date;
  createdAt: Date;
}

export interface BackendConnectedUserUser {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: 'USER' | 'MODERATOR' | 'ADMINISTRATOR';
  status: 'OFFLINE' | 'AWAY_FROM_KEYBOARD' | 'OFF_DUTY' | 'ON_DUTY';
  groupId: string;
  departmentIds: string[];
  terminated: boolean;
}

export interface BackendConnectedUser {
  id: string;
  userId: string;
  socketId: string;
  user: BackendConnectedUserUser;
  createdAt: Date;
}
