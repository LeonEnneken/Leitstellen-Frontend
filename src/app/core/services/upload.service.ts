import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) {

  }

  upload(formData: FormData) {
    return this.http.post<BackendUpload>('/api/upload', formData);
  }
}

export interface BackendUpload {
  uri: string;
  fileName: string;
  size: number;
}
