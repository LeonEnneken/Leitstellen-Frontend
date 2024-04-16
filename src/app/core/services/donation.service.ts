import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DonationService {

  constructor(private http: HttpClient) {

  }

  getCurrent() {
    return this.http.get<TransactionCurrentReponse>('https://donations.grand-roleplay.de/api/transactions/current');
  }
}

export interface TransactionCurrentDatesResponse {
  current: Date;
  first: Date;
  last: Date;
}

export interface TransactionCurrentAmountsReponse {
  current: number;
  max: number;
}

export interface TransactionCurrentReponse {
  dates: TransactionCurrentDatesResponse;
  amounts: TransactionCurrentAmountsReponse;
}
