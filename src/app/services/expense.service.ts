import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { Expense } from '../models/expense.model';
import 'rxjs/add/operator/map';

@Injectable()
export class ExpenseService {
    private dataServiceURI = '/api/expenseService';

    constructor(private http: Http) { }

    public getExpenses(): Observable<any> {
        return this.http.get(this.dataServiceURI)
            .map(res => res.json());
    }

    public getExpense(id: string): Observable<any> {
        return this.http.get(`${this.dataServiceURI}/${id}`)
            .map(res => res.json());
    }

    public add(order: Expense): Observable<any> {
        return this.http.post(this.dataServiceURI, order)
            .map(res => res.json());
    }

    public update(id: string, order: Expense): Observable<any> {
        return this.http.put(`${this.dataServiceURI}/${id}`, order)
            .map(res => res.json());
    }

    public delete(id: string): Observable<any> {
        return this.http.delete(`${this.dataServiceURI}/${id}`)
            .map(res => res.json());
    }
}
