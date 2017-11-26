import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class OrderComponent implements OnInit {

  caption: string;
  contactId: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.getRouterParams();
  }

  getRouterParams() {
    this.route.queryParams.subscribe((params: any) => {
      this.contactId = params['contactId'];
      this.caption = this.contactId ? 'New order for ' + this.contactId : 'New order';
    });
  }

}
