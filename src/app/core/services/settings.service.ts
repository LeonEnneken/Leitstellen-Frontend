import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SettingsService implements OnDestroy {

  private settings: BehaviorSubject<BackendSettings> = new BehaviorSubject(undefined);

  private interval: any;

  constructor(private _httpClient: HttpClient) {
    this.interval = setInterval(() => {
      this.getSettings().subscribe();
    }, 1000 * 60 * 15);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  get get() {
    return this.settings;
  }

  getSettings() {
    return this._httpClient.get<BackendSettings>('/api/settings').pipe(tap((response) => {
      this.settings.next(response);
    }));
  }

  patchSettings(id: string, body: SettingsBody) {
    return this._httpClient.patch<BackendSettings>(`/api/settings/${id}`, body);
  }

  postHeaderDetails(body: SettingsHeaderDetailsBody) {
    return this._httpClient.post<BackendSettingsHeaderDetails>('/api/settings/header-details', body);
  }

  patchHeaderDetails(id: string, body: SettingsHeaderDetailsBody) {
    return this._httpClient.patch<BackendSettingsHeaderDetails>(`/api/settings/header-details/${id}`, body);
  }

  deleteHeaderDetails(id: string) {
    return this._httpClient.delete<BackendSettingsHeaderDetails>(`/api/settings/header-details/${id}`);
  }

  postControlCenterStatus(settingsId: string, body: SettingsControlCenterStatusBody) {
    return this._httpClient.post<BackendSettingsControlCenterStatus>(`/api/settings/${settingsId}/control-center-status`, body);
  }

  patchControlCenterStatus(settingsId: string, id: string, body: SettingsControlCenterStatusBody) {
    return this._httpClient.patch<BackendSettingsHeaderDetails>(`/api/settings/${settingsId}/control-center-status/${id}`, body);
  }

  deleteControlCenterStatus(settingsId: string, id: string) {
    return this._httpClient.delete<BackendSettingsHeaderDetails>(`/api/settings/${settingsId}/control-center-status/${id}`);
  }

}

export interface SettingsHeaderDetailsBody {
  index: number;
  type: 'TOP' | 'BOTTOM';
  label: string;
  value: string;
  color: string;
}

export interface BackendSettingsLoginPage {
  title: string;
  description: string;
}

export interface SettingsControlCenterStatusBody {
  label: string;
  value: string;
  color: 'BLUE' | 'RED' | 'AMBER' | 'GREEN';
}

export interface SettingsBody {
  organisationName: string;
  logoUrl: string;
  loginPage: BackendSettingsLoginPage;
  hasDutyNumber?: boolean;
}

export interface BackendSettingsHeaderDetails {
  id: string;
  index: number;
  type: 'TOP' | 'BOTTOM';
  label: string;
  value: string;
  color: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface BackendSettingsOptions {
  hasDutyNumber: boolean;
}

export interface BackendSettingsControlCenterStatus {
  id: string;
  settingsId: string;
  label: string;
  value: string;
  color: 'BLUE' | 'RED' | 'AMBER' | 'GREEN';
  updatedAt: Date;
  createdAt: Date;
}

export interface BackendSettings {
  id: string;
  organisationName: string;
  logoUrl: string;
  baseUrl: string;
  socketUrl: string;
  loginPage: BackendSettingsLoginPage;
  fieldOfStudy?: FieldOfStudy[];
  trainings?: Training[];
  options?: BackendSettingsOptions;
  controlCenterStatus: BackendSettingsControlCenterStatus[];
  headerDetailsTop: BackendSettingsHeaderDetails[];
  headerDetailsBottom: BackendSettingsHeaderDetails[];
  maintenance: boolean;
  updatedAt: Date;
  createdAt: Date;
}

export interface FieldOfStudy {
  label: string;
  key: string;
  type: string;
}

export interface Training {
  label: string;
  key: string;
  type: string;
}
