import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Observable ,  Subject } from 'rxjs';
import 'rxjs/observable/of';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  private dataServiceURI = '/api/userService';
  private currentUser: User;
  private currentUserSubject = new Subject<User>();

  constructor(private http: HttpClient) {
    // this.setCurrentUser();
  }

  public login(user): Observable<User> {
    return this.http.post('/login', user)
    .map(response => {
      this.currentUser = new User(response);
      this.currentUserSubject.next(this.currentUser);
      return this.currentUser;
    });
  }

  public logout() {
    return this.http.post('/logout', null);
  }

  public getCurrentUser(): Observable<User> {
    if (this.currentUser) {
      setTimeout(
        () => this.currentUserSubject.next(this.currentUser)
      );
    }
    this.requestCurrentUser();
    return this.currentUserSubject.asObservable();
  }

  private async requestCurrentUser() {
    const query = this.http.get(`${this.dataServiceURI}/currentUser`)
      .map(response => {
        this.currentUser = new User(response);
        return this.currentUser;
      });
    this.currentUser = await query.toPromise();
    this.currentUserSubject.next(this.currentUser);
  }
}
