import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class VehiclesService {

  private vehicles: BehaviorSubject<BackendVehicle[]> = new BehaviorSubject([]);

  constructor(private userService: UserService, private http: HttpClient) {
    this.userService.user$.subscribe((user) => {
      if (user && user.createdAt !== null && user.createdAt !== undefined) {
        this.init();
      }
    });
  }

  private init() {
    this.getAll().subscribe((response) => {
      this.vehicles.next(response);
    });
  }

  get get() {
    return this.vehicles;
  }

  getAll() {
    return this.http.get<BackendVehicle[]>('/api/vehicle');
  }

  post(body: VehicleBody) {
    return this.http.post<BackendVehicle>('/api/vehicle', body);
  }

  patch(id: string, body: VehicleBody) {
    return this.http.patch<BackendVehicle>(`/api/vehicle/${id}`, body);
  }

  delete(id: string) {
    return this.http.delete<BackendVehicle>(`/api/vehicle/${id}`);
  }

}


export class VehicleBody {
  name: string;
  licensePlate: string;
  groupId?: string;
  departmentId?: string;
}

export class BackendVehicle {
  id: string;
  name: string;
  licensePlate: string;
  groupId?: string;
  departmentId?: string;
  updatedAt: Date;
  createdAt: Date;
}
