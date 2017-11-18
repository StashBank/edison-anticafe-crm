import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LookupsService } from '../services/lookups.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  lookups: any[];

  constructor(
    private router: Router,
    private lookupsService: LookupsService
  ) { }

  ngOnInit() {
    this.lookupsService.get()
      .subscribe(data => this.lookups = data);
  }

}
