import { UserService } from './../services/user.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LookupsService } from '../services/lookups.service';
import { User } from '../models/user.model';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  lookups: any[];
  currentUser: User;

  constructor(
    private router: Router,
    private lookupsService: LookupsService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.lookupsService.get()
      .subscribe(data => this.lookups = data);
    const query = this.userService.getCurrentUser();
    query.subscribe(user => this.currentUser = user);
  }

  logout() {
    this.userService.logout().subscribe(response => {
      this.currentUser = null;
        this.router.navigate(['login']);
    });
  }

}
