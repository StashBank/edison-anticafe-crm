import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Observable ,  Subject } from 'rxjs';
import 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Injectable()
export class UserService {

  private dataServiceURI = '/api/userService';
  private _currentUser: User;
  private set currentUser(value: User) {
    this._currentUser = value;
    this.currentUserSubject.next(value);
  }
  private get currentUser(): User {
    return this._currentUser;
  }
  private currentUserSubject = new Subject<User>();
  private authenticatedSubject = new Subject<boolean>();
  private _isAuthenticated: boolean;
  private set isAuthenticated (value: boolean) {
    this._isAuthenticated = value;
    this.authenticatedSubject.next(this.isAuthenticated);
  }
  private get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  constructor(private http: HttpClient) {
    // this.setCurrentUser();
  }

  public login(user): Observable<User> {
    return this.http.post('/login', user)
    .map(response => {
      this.currentUser = new User(response);
      this.currentUserSubject.next(this.currentUser);
      if (this.currentUser) {
        this.isAuthenticated = true;
      }
      return this.currentUser;
    });
  }

  public logout() {
    return this.http.post('/logout', null).do(() => {
      this.currentUserSubject.next(null);
      this.isAuthenticated = false;
    });
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

  public onAuthenticated(): Observable<boolean> {
    if (this.isAuthenticated !== undefined) {
      setTimeout(() => this.authenticatedSubject.next(this.isAuthenticated), 100);
    }
    return this.authenticatedSubject.asObservable();
  }

  private async requestCurrentUser() {
    const query = this.http.get(`${this.dataServiceURI}/currentUser`)
      .map(response => {
        this.currentUser = new User(response);
        return this.currentUser;
      });
    this.currentUser = await query.toPromise();
    if (!this.isAuthenticated && this.currentUser) {
      this.isAuthenticated = true;
    }
  }
}
