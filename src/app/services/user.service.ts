import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user.model';
import 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class UserService {

  private dataServiceURI = '/api/userService';
  private currentUser: User;
  private currentUserSubject = new Subject<User>();

  constructor(private http: Http) {
    // this.setCurrentUser();
  }

  public login(user) {
    return this.http.post('/login', user)
    .map(response => {
      this.currentUser = new User(response.json());
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
        this.currentUser = new User(response.json());
        return this.currentUser;
      });
    this.currentUser = await query.toPromise();
    this.currentUserSubject.next(this.currentUser);
  }
}
