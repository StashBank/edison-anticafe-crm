import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '../models/user.model';

@Injectable()

export class NewUserService {

  constructor(private http: HttpClient) { }

  private dataServiceURI = '/api/userService';
  private dataServiceChangePassURI = '/api/userService/changePassword';

  public getInfoAboutCurrentUser(id: string): Observable<any> {
    return this.http.get(`${this.dataServiceURI}/${id}`);
  }

  public createNewUser(userData: User): Observable<any> {
    return this.http.post(this.dataServiceURI, userData);
  }

  public changeDataOfUser(id: string, userData: User) {
    return this.http.put(`${this.dataServiceURI}/${id}`, userData);
  }

  public changeUserPassword(id: string, userData: User) {
    return this.http.put(`${this.dataServiceChangePassURI}/${id}`, userData);
  }
}
