import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { Observable } from 'rxjs';

import { Expense } from '../models/expense.model';


@Injectable()
export class ExpenseService {
    private dataServiceURI = '/api/expenseService';

  constructor(private http: HttpClient) { }

    public getExpenses(): Observable<any> {
        return this.http.get(this.dataServiceURI);
    }

    public getExpense(id: string): Observable<any> {
        return this.http.get(`${this.dataServiceURI}/${id}`);
    }

    public add(order: Expense): Observable<any> {
        return this.http.post(this.dataServiceURI, order);
    }

    public update(id: string, order: Expense): Observable<any> {
        return this.http.put(`${this.dataServiceURI}/${id}`, order);
    }

    public delete(id: string): Observable<any> {
        return this.http.delete(`${this.dataServiceURI}/${id}`);
    }
}
