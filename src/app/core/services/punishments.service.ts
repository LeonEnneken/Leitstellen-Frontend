import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PunishmentsService {

  constructor(private _http: HttpClient) {

  }

  getAll() {
    return this._http.get<BackendPunishmentCategory[]>('/api/punishment');
  }


  post(body: PunishmentCategoryBody) {
    return this._http.post<BackendPunishmentCategory>('/api/punishment', body);
  }

  patch(categoryId: string, body: PunishmentCategoryBody) {
    return this._http.patch<BackendPunishmentCategory>(`/api/punishment/${categoryId}`, body);
  }

  delete(categoryId: string) {
    return this._http.delete<BackendPunishmentCategory>(`/api/punishment/${categoryId}`);
  }


  postPunishment(categoryId: string, body: PunishmentBody) {
    return this._http.post<BackendPunishment>(`/api/punishment/${categoryId}`, body);
  }

  patchPunishment(categoryId: string, id: string, body: PunishmentBody) {
    return this._http.patch<BackendPunishment>(`/api/punishment/${categoryId}/${id}`, body);
  }

  deletePunishment(categoryId: string, id: string) {
    return this._http.delete<BackendPunishment>(`/api/punishment/${categoryId}/${id}`);
  }


  postPunishmentItem(categoryId: string, id: string, body: PunishmentItemBody) {
    return this._http.post<BackendPunishmentItem>(`/api/punishment/${categoryId}/${id}`, body);
  }

  patchPunishmentItem(categoryId: string, id: string, itemId: string, body: PunishmentItemBody) {
    return this._http.patch<BackendPunishmentItem>(`/api/punishment/${categoryId}/${id}/${itemId}`, body);
  }

  deletePunishmentItem(categoryId: string, id: string, itemId: string) {
    return this._http.delete<BackendPunishmentItem>(`/api/punishment/${categoryId}/${id}/${itemId}`);
  }
}

export interface PunishmentItemBody {
  id?: string;
  stage: number;
  strikes: number;
  additionalPunishment: string;
}

export interface PunishmentBody {
  uniqueId: number;
  description: string;
  items?: PunishmentItemBody[];
}

export interface PunishmentCategoryBody {
  uniqueId: number;
  label: string;
  punishment?: PunishmentBody;
}

export interface BackendPunishmentItem {
  id: string;
  punishmentId: string;
  stage: number;
  strikes: number;
  additionalPunishment: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface BackendPunishment {
  id: string;
  categoryId: string;
  uniqueId: number;
  description: string;
  items: BackendPunishmentItem[];
  updatedAt: Date;
  createdAt: Date;
}

export interface BackendPunishmentCategory {
  id: string;
  uniqueId: number;
  label: string;
  punishments: BackendPunishment[];
  updatedAt: Date;
  createdAt: Date;
}
