import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { Income } from '../models/income.model';
import 'rxjs/add/operator/map';

@Injectable()
export class IncomeService {
    private dataServiceURI = '/api/incomeService';

    constructor(private http: Http) { }

    public getIncomes(): Observable<any> {
        return this.http.get(this.dataServiceURI)
            .map(res => res.json());
    }

    public getIncome(id: string): Observable<any> {
        return this.http.get(`${this.dataServiceURI}/${id}`)
            .map(res => res.json());
    }

    public add(order: Income): Observable<any> {
        return this.http.post(this.dataServiceURI, order)
            .map(res => res.json());
    }

    public update(id: string, order: Income): Observable<any> {
        return this.http.put(`${this.dataServiceURI}/${id}`, order)
            .map(res => res.json());
    }

    public delete(id: string): Observable<any> {
        return this.http.delete(`${this.dataServiceURI}/${id}`)
            .map(res => res.json());
    }
}
