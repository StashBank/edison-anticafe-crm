import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LookupsService } from '../services/lookups.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  private _currentUser: User;
  @Input() set currentUser( value: User) {
    this._currentUser = value;
    this.loadLookups();
  }
  get currentUser(): User {
    return this._currentUser;
  }
  @Output() logOut = new EventEmitter<any>();
  lookups: any[];

  constructor(
    private lookupsService: LookupsService,
  ) { }

  ngOnInit() {
  }

  loadLookups() {
    if (!this.lookups) {
      this.lookupsService.get().subscribe(data => this.lookups = data);
    }
  }

  logout() {
    this.logOut.emit();
  }

}
