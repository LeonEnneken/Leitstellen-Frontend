import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class ControlCentersService {

  private controlCenters: BehaviorSubject<BackendControlCenter[]> = new BehaviorSubject([]);

  onDuty: BehaviorSubject<BackendControlCenterMember[]> = new BehaviorSubject([]);
  offDuty: BehaviorSubject<BackendControlCenterMember[]> = new BehaviorSubject([]);
  awayFromKeyboard: BehaviorSubject<BackendControlCenterMember[]> = new BehaviorSubject([]);

  details: BehaviorSubject<BackendControlCenterDetails[]> = new BehaviorSubject([]);

  constructor(
    private userService: UserService,
    private websocketService: WebsocketService,
    private http: HttpClient
  ) {

    this.websocketService.getSocket().subscribe((socket) => {
      if (!(socket)) {
        return;
      }
      if (!(userService.hasPermissions('CONTROL_CENTERS_SHOW'))) {
        return;
      }
      socket.on('ON_DUTY', (data) => {
        this.onDuty.next(JSON.parse(data));
      });
      socket.on('OFF_DUTY', (data) => {
        this.offDuty.next(JSON.parse(data));
      });
      socket.on('AWAY_FROM_KEYBOARD', (data) => {
        this.awayFromKeyboard.next(JSON.parse(data));
      });
      socket.on('control-center-details', (data) => {
        this.details.next(JSON.parse(data));
      });
    });

    this.userService.user$.subscribe((user) => {
      if (user && user.createdAt !== null && user.createdAt !== undefined) {
        this.init();
      }
    });
  }

  private init() {
    this.getAll().subscribe((response) => {
      this.controlCenters.next(response);
    });
  }

  get get() {
    return this.controlCenters;
  }

  getAll() {
    return this.http.get<BackendControlCenter[]>('/api/control-center');
  }

  post(body: ControlCenterBody) {
    return this.http.post<BackendControlCenter>('/api/control-center', body);
  }

  patch(id: string, body: ControlCenterBody) {
    return this.http.patch<BackendControlCenter>(`/api/control-center/${id}`, body);
  }

  delete(id: string) {
    return this.http.delete<BackendControlCenter>(`/api/control-center/${id}`);
  }

  addUser(id: string, userId: string) {
    return this.http.patch<BackendControlCenter>(`/api/control-center/${id}/member/${userId}`, undefined);
  }

  removeUser(id: string, userId: string) {
    return this.http.delete<BackendControlCenter>(`/api/control-center/${id}/member/${userId}`);
  }

  patchStatus(id: string, status: string) {
    return this.http.patch<BackendControlCenter>(`/api/control-center/${id}/status/${status}`, undefined);
  }

  patchVehicle(id: string, vehicleId: string) {
    return this.http.patch<BackendControlCenter>(`/api/control-center/${id}/vehicle/${vehicleId}`, undefined);
  }

  deleteVehicle(id: string) {
    return this.http.delete<BackendControlCenter>(`/api/control-center/${id}/vehicle`);
  }

  getDetailsByStatus(status: 'ON_DUTY' | 'OFF_DUTY' | 'AWAY_FROM_KEYBOARD') {
    return this.http.get<BackendControlCenterMember[]>(`/api/control-center/status/${status}`);
  }
}


export interface ControlCenterBody {
  label: string;
  type: string;
  color?: string;
  hasStatus: boolean;
  hasVehicle: boolean;
  maxMembers: number;
}

export interface ControlCenterMember {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  groupId: string;
  departmentIds: string[];
}

export interface BackendControlCenterDetails {
  id: string;
  type: string;
  status?: string;
  vehicle?: string;
  members: ControlCenterMember[];
}



export interface BackendControlCenterMemberControlCenter {
  id: string;
  label: string;
  type: string;
}

export interface BackendControlCenterMember {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  groupId: string;
  departmentIds: string[];
  dutyNumber?: string;
  controlCenter: BackendControlCenterMemberControlCenter;
}


export interface BackendControlCenter {
  id: string;
  label: string;
  type: string;
  color?: string;
  hasStatus: boolean;
  status?: string;
  hasVehicle: boolean;
  vehicle?: string;
  members: string[];
  maxMembers: number;
  updatedAt: Date;
  createdAt: Date;
}
