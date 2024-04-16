import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';

import { SettingsService } from './settings.service';

export interface Message {
  source: string;
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket: BehaviorSubject<Socket> = new BehaviorSubject(undefined);

  constructor(private authService: AuthService, private settingsService: SettingsService, private userService: UserService) {
    this.init();
  }

  private init() {
    this.userService.user$.subscribe((user) => {
      if (user && user.createdAt !== null && user.createdAt !== undefined) {
        this.connectSocket();
      } else {
        this.socket.value.disconnect();
        this.socket.next(undefined);
      }
    });
  }

  connectSocket() {
    if (this.socket.value) {
      return;
    }
    const socket = io(window.location.host, {
      path: '/api/socket.io',
      extraHeaders: {
        Authorization: this.authService.accessToken
      },
      upgrade: true
    });

    socket.on('connect', () => {
      console.log('Socket-Client connected!');
    });

    socket.on('error', (error: Error) => {
      console.error(error);
    });

    this.socket.next(socket);
  }

  getSocket(): Observable<Socket> {
    return this.socket.asObservable();
  }

  sendEvent(key: string, data?: any) {
    if(this.socket.value) {
      this.socket.value.emit(key, data);
    }
  }

}
