import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {

  private departments: BehaviorSubject<BackendDepartment[]> = new BehaviorSubject([]);

  constructor(private userService: UserService, private http: HttpClient) {
    this.userService.user$.subscribe((user) => {
      if(user && user.createdAt !== null && user.createdAt !== undefined) {
        this.init();
      }
    });
  }

  private init() {
    this.getAll().subscribe((response) => {
      this.departments.next(response);
    });
  }

  get get() {
    return this.departments;
  }

  getAll() {
    return this.http.get<BackendDepartment[]>('/api/department');
  }

  post(body: DepartmentBody) {
    return this.http.post<BackendDepartment>('/api/department', body);
  }

  patch(id: string, body: DepartmentBody) {
    return this.http.patch<BackendDepartment>(`/api/department/${id}`, body);
  }

  delete(id: string) {
    return this.http.delete<BackendDepartment>(`/api/department/${id}`);
  }

}

export interface DepartmentBody {
  name: string;
  permissions: string[];
  data?: Object;
}

export interface BackendDepartment {
  id: string;
  name: string;
  permissions: string[];
  data?: Object;
  default: boolean;
  updatedAt: Date;
  createdAt: Date;
}
