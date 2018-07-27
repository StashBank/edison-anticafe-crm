import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LookupsService } from '../services/lookups.service';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  lookups: any[];
  currentUser: User;
  private _isAuthenticated: boolean;
  public set isAuthenticated(value: boolean) {
    this._isAuthenticated = value;
    if (value) {
      this.onAuthenticated();
    }
  }
  public get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  constructor(
    private router: Router,
    private lookupsService: LookupsService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(
      user => this.currentUser = user
    );
    this.userService.onAuthenticated().subscribe(
      isAuthenticated => this.isAuthenticated = isAuthenticated
    );
  }

  onAuthenticated() {
    this.loadLookups();
  }

  loadLookups() {
    this.lookupsService.get()
      .subscribe(data => this.lookups = data);
  }

  logout() {
    this.userService.logout().subscribe(response => {
      this.router.navigate(['/login']);
    });
  }

}
