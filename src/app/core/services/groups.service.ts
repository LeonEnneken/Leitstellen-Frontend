import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  private groups: BehaviorSubject<BackendGroup[]> = new BehaviorSubject([]);

  constructor(private userService: UserService, private http: HttpClient) {
    this.userService.user$.subscribe((user) => {
      if (user && user.createdAt !== null && user.createdAt !== undefined) {
        this.init();
      }
    });
  }

  private init() {
    this.getAll().subscribe((response) => {
      this.groups.next(response);
    });
  }

  get get() {
    return this.groups;
  }

  getAll(): Observable<BackendGroup[]> {
    return this.http.get<BackendGroup[]>('/api/group');
  }

  post(body: GroupBody): Observable<BackendGroup> {
    return this.http.post<BackendGroup>('/api/group', body);
  }

  patch(id: string, body: GroupBody): Observable<BackendGroup> {
    return this.http.patch<BackendGroup>(`/api/group/${id}`, body);
  }

  delete(id: string): Observable<BackendGroup> {
    return this.http.delete<BackendGroup>(`/api/group/${id}`);
  }

}


export interface GroupBody {
  uniqueId: number;
  name: string;
  shortName: string;
  division?: string;
  permissions: string[];
  data?: Object;
  showInOverview?: boolean;
}

export interface BackendGroup {
  id: string;
  uniqueId: number;
  name: string;
  shortName: string;
  division?: string;
  permissions: string[];
  data?: Object;
  showInOverview?: boolean;
  default: boolean;
  updatedAt: Date;
  createdAt: Date;
}
