import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class RadioCodesService {

  private radioCodes: BehaviorSubject<BackendRadioCode[]> = new BehaviorSubject([]);

  constructor(private userService: UserService, private http: HttpClient) {
    this.userService.user$.subscribe((user) => {
      if(user && user.createdAt !== null && user.createdAt !== undefined) {
        this.init();
      }
    });
  }

  private init() {
    this.getAll().subscribe((response) => {
      this.radioCodes.next(response);
    });
  }

  get get() {
    return this.radioCodes;
  }

  getAll() {
    return this.http.get<BackendRadioCode[]>('/api/radio-code');
  }

  post(body: RadioCodeBody) {
    return this.http.post<BackendRadioCode>('/api/radio-code', body);
  }

  patch(id: string, body: RadioCodeBody) {
    return this.http.patch<BackendRadioCode>(`/api/radio-code/${id}`, body);
  }

  delete(id: string) {
    return this.http.delete<BackendRadioCode>(`/api/radio-code/${id}`);
  }

}

export interface RadioCodeBody {
  type: 'NORMAL' | 'INFO' | 'WARN';
  code: string;
  description: string;
}

export interface BackendRadioCode {
  id: string;
  type: 'NORMAL' | 'INFO' | 'WARN';
  code: string;
  description: string;
  updatedAt: Date;
  createdAt: Date;
}
