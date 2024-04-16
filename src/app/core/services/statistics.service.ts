import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  private counts: BehaviorSubject<any> = new BehaviorSubject(undefined);

  constructor(private webSocketService: WebsocketService, private _http: HttpClient) {
    this.webSocketService.getSocket().subscribe((socket) => {
      if(!(socket)) {
        return;
      }
      socket.on('statistics', (data) => {
        this.counts.next(JSON.parse(data));
      });
    });
  }

  get getCounts() {
    return this.counts;
  }

  getTrackings(startDate: number, endDate: number) {
    return this._http.get<BackendTrackings[]>(`/api/statistics/trackings/${startDate}/${endDate}`);
  }

}

export interface BackendTrackingsItem {
  id: string;
  controlCenterId: string;
  startDate: number;
  endDate: number;
  time: number;
  finished: boolean;
}

export interface BackendTrackingsUser {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  groupId: string;
  departmentIds: string[];
}

export interface BackendTrackings {
  id: string;
  user: BackendTrackingsUser;
  items: BackendTrackingsItem[];
  totalTime: number;
}
