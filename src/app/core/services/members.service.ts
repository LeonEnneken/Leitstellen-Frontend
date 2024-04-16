import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  constructor(private http: HttpClient) {

  }

  getAll() {
    return this.http.get<BackendMember[]>('/api/member');
  }

  getPhoneNumbers() {
    return this.http.get<BackendMemberPhoneNumber[]>('/api/member/phone-numbers');
  }

  patch(id: string, body: MemberBody) {
    return this.http.patch<BackendMember>(`/api/member/${id}`, body);
  }

  hire(id: string) {
    return this.http.patch<BackendMember>(`/api/member/${id}/hire`, undefined);
  }

  terminate(id: string) {
    return this.http.delete<BackendMember>(`/api/member/${id}/terminate`);
  }

}



export interface MemberUserBody {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  status: 'OFFLINE' | 'AWAY_FROM_KEYBOARD' | 'OFF_DUTY' | 'ON_DUTY';
}

export interface MemberBody {
  groupId: string;
  departmentIds: string[];
  dutyNumber?: string;
  user: MemberUserBody;
  notes?: string;
  data?: Object;
  hiredDate: Date;
  lastPromotionDate: Date;
}

export interface BackendMemberUser {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  status: 'OFFLINE' | 'AWAY_FROM_KEYBOARD' | 'OFF_DUTY' | 'ON_DUTY';
}

export interface BackendMember {
  id: string;
  userId: string;
  groupId: string;
  departmentIds: string[];
  dutyNumber?: string;
  notes?: string;
  data?: any;
  hiredDate: Date;
  lastPromotionDate: Date;
  user: BackendMemberUser;
  terminatedAt?: Date;
  terminated: boolean;
  updatedAt: Date;
  createdAt: Date;
}



export interface BackendMemberPhoneNumber {
  userId: string;
  avatar: string;
  fullName: string;
  phoneNumber: string;
}
