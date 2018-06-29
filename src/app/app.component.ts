import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public currentUser: User;
  
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    const query = this.userService.getCurrentUser();
    query.subscribe(user => this.currentUser = user);
  }

  onLogout() {
    this.userService.logout().subscribe(response => {
      this.currentUser = null;
      this.router.navigate(['/login']);
    });
  }

}
