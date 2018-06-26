import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { Observable } from 'rxjs';

import { Income } from '../models/income.model';


@Injectable()
export class IncomeService {
    private dataServiceURI = '/api/incomeService';

  constructor(private http: HttpClient) { }

    public getIncomes(): Observable<any> {
        return this.http.get(this.dataServiceURI);
    }

    public getIncome(id: string): Observable<any> {
        return this.http.get(`${this.dataServiceURI}/${id}`);
    }

    public add(order: Income): Observable<any> {
        return this.http.post(this.dataServiceURI, order);
    }

    public update(id: string, order: Income): Observable<any> {
        return this.http.put(`${this.dataServiceURI}/${id}`, order);
    }

    public delete(id: string): Observable<any> {
        return this.http.delete(`${this.dataServiceURI}/${id}`);
    }
}
