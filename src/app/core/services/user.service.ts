import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {

  private _user: BehaviorSubject<BackendUser | undefined> = new BehaviorSubject<BackendUser | undefined>(undefined);

  private interval: any;

  constructor(private _httpClient: HttpClient) {
    this.interval = setInterval(() => {
      this.get().subscribe();
    }, 1000 * 60);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  set user(value: BackendUser) {
    this._user.next(value);
  }

  get user$() {
    return this._user.asObservable();
  }

  hasPermissions(permission: string) {
    if (!(this._user.value)) {
      return false;
    }
    if(this._user.value.role === 'ADMINISTRATOR') {
      return true;
    }
    const permissions = this._user.value?.permissions ?? [];

    if (permissions.includes('*')) {
      return true;
    }
    return permissions.includes(permission);
  }

  get() {
    return this._httpClient.get<BackendUser>('/api/user/me').pipe(tap((user) => {
      this._user.next(user);
    }));
  }

  getActiveFileSheets() {
    return this._httpClient.get<BackendUserActiveFileSheet[]>('/api/user/file-sheets');
  }

  setupUser(setup: BackendUserSetup) {
    return this._httpClient.post<BackendUser>('/api/user/setup', {
      id: setup.id,
      firstName: setup.firstName,
      lastName: setup.lastName,
      phoneNumber: setup.phoneNumber
    }).pipe(tap((user) => {
      if(user.createdAt) {
        this._user.next(user);
      }
    }));
  }

  updateStatus(status: 'ON_DUTY' | 'OFF_DUTY' | 'AWAY_FROM_KEYBOARD' | 'OFFLINE') {
    this._httpClient.patch('/api/user/status', {
      status: status
    }).subscribe(() => {
      this.get().subscribe();
    });
  }

  updateStatusOther(userId: string, status: 'ON_DUTY' | 'OFF_DUTY' | 'AWAY_FROM_KEYBOARD' | 'OFFLINE') {
    return this._httpClient.patch(`/api/user/status/${userId}`, {
      status: status
    });
  }

  searchByType(type: 'ALL' | 'ON_DUTY' | 'OFF_DUTY' | 'AWAY_FROM_KEYBOARD' | 'OFFLINE') {
    return this._httpClient.get<BackendUserSearch[]>(`/api/user/search/${type}`);
  }
}

export interface BackendUserAccount {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
}

export interface BackendUserDetails {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface BackendUserGroup {
  id: string;
  uniqueId: number;
  name: string;
}

export interface BackendUser {
  id: string;
  account: BackendUserAccount;
  details?: BackendUserDetails;
  role: 'USER' | 'MODERATOR' | 'ADMINISTRATOR';
  status: 'OFFLINE' | 'AWAY_FROM_KEYBOARD' | 'OFF_DUTY' | 'ON_DUTY';
  dutyNumber?: string;
  group: BackendUserGroup;
  permissions: string[];
  hiredDate?: Date;
  lastPromotionDate?: Date;
  data?: any;
  updatedAt: Date;
  createdAt: Date;
}


export interface BackendUserSetup {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface BackendUserActiveFileSheet {
  id: string;
  title: string;
  strikes: number;
  additionalPunishment: string;
  createdAt: Date;
}

export interface BackendUserSearch {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  groupId: string;
  departmentIds: string[];
}
