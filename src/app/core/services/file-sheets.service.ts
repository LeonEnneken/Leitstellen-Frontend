import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileSheetsService {

  constructor(private _http: HttpClient) {

  }

  getStrikes(): Observable<FileSheetStrikesResponse[]> {
    return this._http.get<FileSheetStrikesResponse[]>('/api/file-sheet/strikes');
  }

  getAll(type: 'NOT_APPROVED' | 'APPROVED' | 'FINISHED') {
    return this._http.get<BackendFileSheet[]>(`/api/file-sheet/${type}`);
  }

  post(body: FileSheetPostBody) {
    return this._http.post<BackendFileSheet>('/api/file-sheet', body);
  }

  patch(id: string, body: FileSheetPatchBody) {
    return this._http.patch<BackendFileSheet>(`/api/file-sheet/${id}`, body);
  }

  delete(id: string) {
    return this._http.delete<BackendFileSheet>(`/api/file-sheet/${id}`);
  }

  approve(id: string) {
    return this._http.patch<BackendFileSheet>(`/api/file-sheet/${id}/approve`, undefined);
  }

  cancel(id: string) {
    return this._http.patch<BackendFileSheet>(`/api/file-sheet/${id}/cancel`, undefined);
  }

}

export interface FileSheetBody {
  targetId: string;
  punishmentId: string;
  strikes: number;
  additionalPunishment: string;
  notes?: string;
  attachments: string[];
  additionalPunishmentFinished: boolean;
}

export interface FileSheetPostBody {
  targetId: string;
  punishmentId: string;
  strikes: number;
  additionalPunishment: string;
  notes?: string;
  attachments?: string[];
}

export interface FileSheetPatchBody {
  strikes: number;
  additionalPunishment: string;
  notes?: string;
  attachments?: string[];
  additionalPunishmentFinished: boolean;
}

export interface BackendFileSheetUser {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  groupId?: string;
  departmentIds?: string[];
  terminated?: boolean;
}

export interface BackendFileSheet {
  id: string;
  senderId: string;
  sender?: BackendFileSheetUser;
  targetId: string;
  target?: BackendFileSheetUser;
  punishmentId: string;
  title: string;
  strikes: number;
  additionalPunishment: string;
  notes?: string;
  attachments: string[];
  additionalPunishmentFinished: boolean;
  approved: boolean;
  canceled: boolean;
  updatedAt: Date;
  createdAt: Date;
}


export interface FileSheetStrikesTargetResponse {
  id: string;
  firstName: string;
  lastName: string;
  groupId: string;
  departmentIds: string[];
  terminated: boolean;
}

export interface FileSheetStrikesItemResponse {
  id: string;
  title: string;
  strikes: number;
  additionalPunishment: string;
  createdAt: Date;
}

export interface FileSheetStrikesResponse {
  id: string;
  strikes: number;
  target: FileSheetStrikesTargetResponse;
  items: FileSheetStrikesItemResponse[];
}
