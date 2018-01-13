import { MatSnackBar } from '@angular/material';
import { Product } from './../../models/product.model';
import { Observable } from 'rxjs/Observable';
import { OrderService } from './../../services/order.service';
import { ContactServiceService } from './../../services/contact-service.service';
import { Order, OrderStatus } from './../../models/order.model';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { LookupsService } from './../../services/lookups.service';
import { Lookup } from '../../models/base.types';
import { Contact } from '../../models/contact.model';
import { NgxSpinnerService } from 'ngx-spinner';
import 'rxjs/add/operator/finally';

@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class OrderCardComponent implements OnInit {

  caption: string;
  contactId: string;
  anonymous = true;
  order: Order;
  form: FormGroup;
  productList: any[];
  orderstatusList: any[];
  isNew = true;
  lookupTypes = {
    'Product': Product,
    'OrderStatus': OrderStatus
  };

  get orderStatusNew(): any {
    return this.getOrderStatus('New');
  }

  get orderStatusInProgress(): any {
    return this.getOrderStatus('InProgress');
  }

  get orderStatusPostponed(): any {
    return this.getOrderStatus('Postponed');
  }

  get currentStatus(): string {
    return this.form.controls['status'].value;
  }

  get performButtonVisible(): boolean {
    if (!this.isNew  && this.orderstatusList) {
      return this.currentStatus && this.currentStatus === this.orderStatusNew;
    }
    return !this.isNew;
  }

  get postponeButtonVisible(): boolean {
    if (!this.isNew && this.orderstatusList) {
      return this.currentStatus && this.currentStatus === this.orderStatusInProgress;
    }
    return false;
  }

  get continueButtonVisible(): boolean {
    if (!this.isNew && this.orderstatusList) {
      return this.currentStatus && this.currentStatus === this.orderStatusPostponed;
    }
    return false;
  }

  get closeButtonVisible(): boolean {
    if (!this.isNew && this.orderstatusList) {
      return this.currentStatus && this.currentStatus !== this.orderStatusNew;
    }
    return false;
  }

  get rejectButtonVisible(): boolean {
    if (!this.isNew && this.orderstatusList) {
      return this.currentStatus && this.currentStatus !== this.orderStatusNew;
    }
    return false;
  }

  get isFinalStatus(): boolean {
    if (this.orderstatusList) {
      const status = this.orderstatusList.find(i => i.value === this.currentStatus);
      return status && status.isFinal;
    }
    return false;
  }

  get saveButtonEnabled(): boolean {
    return this.form.touched && this.form.valid;
  }

  get timelines(): any[] {
    return this.order && this.order.timeline && this.order.timeline.timelines || [];
  }

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private contactService: ContactServiceService,
    private orderService: OrderService,
    private lookupsService: LookupsService,
    public snackBar: MatSnackBar,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this.order = new Order();
    this.initFormControls();
    this.initLookups();
    this.getRouterParams();
  }

  initFormControls() {
    this.form = new FormGroup({
      contactName: new FormControl(),
      contact: new FormControl({value: '', disabled: true}),
      number: new FormControl({ value: '', disabled: true }),
      status: new FormControl({ value: null, disabled: true }),
      startDate: new FormControl({ value: this.getDateString(new Date()), disabled: true }),
      endDate: new FormControl({ value: null, disabled: true }),
      cost: new FormControl({ value: null, disabled: true }),
      product: new FormControl(null, Validators.required),
      notes: new FormControl()
    });
  }

  getRouterParams() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.getOrder(id);
      } else {
        this.route.queryParams.subscribe(queryParams => {
          this.contactId = queryParams['contactId'];
          if (this.contactId) {
            this.anonymous = false;
            this.getOrderByContact();
            this.getContact();
          } else {
            this.spinner.hide();
          }
        });
      }
    });
  }

  initLookups() {
    const lookups = ['Product', 'OrderStatus'];
    lookups.forEach(lookupName => {
      this.lookupsService.getLookupData(lookupName)
        .subscribe(res => {
          if (res.success) {
            const listName = lookupName.toLowerCase() + 'List';
            const LookupType = this.lookupTypes[lookupName] || Lookup;
            this[listName] = res.data.map(i => new LookupType(i));
          }
          if (this.isNew && lookupName === 'OrderStatus') {
            this.form.controls.status.setValue(this.orderStatusNew);
            this.order = new Order({
              startDate: new Date(),
              status: new Lookup({ value: this.orderStatusNew })
            });
          }
        });
    });
  }

  getOrderByContact() {
    this.orderService.getOrderByContact(this.contactId)
      .finally(() => this.spinner.hide())
      .subscribe(res => {
        if (res.success && res.data) {
          this.order = new Order(res.data);
          this.setOrderControlValues();
          this.isNew = false;
        }
      });
  }

  getOrder(id: string) {
    this.orderService.getOrder(id)
      .finally(() => this.spinner.hide())
      .subscribe((res) => {
        if (res.success && res.data) {
          this.order = new Order(res.data);
          this.anonymous = !this.order.contact;
          this.setOrderControlValues();
          this.isNew = false;
        }
      });
  }

  setOrderControlValues() {
    for (const columnName of Object.keys(this.order)) {
      const control = this.form.controls[columnName];
      const value = this.order[columnName];
      if (control) {
        control.setValue(this.getConrtolValue(columnName, value));
      }
    }
  }

  getConrtolValue(controlName: string, value: any) {
    if (controlName === 'contact') {
      return value && value.fullName;
    }
    const dateValue = Date.parse(value);
    if (!isNaN(dateValue) && dateValue > 1514000000000) {
      return this.getDateString(new Date(dateValue));
    }
    return value && value.value ? value.value : value;
  }

  getContact() {
    this.contactService.getContact(this.contactId)
      .subscribe(response => {
        if (response.success) {
          const contact = new Contact(response.data);
          this.form.controls.contact.setValue(contact.fullName);
        }
      });
  }

  getDateString(value: Date): string {
    if (!value) {
      return null;
    }
    const day = this.getTwoDigitDateValue(value.getDate());
    const month = this.getTwoDigitDateValue(value.getMonth() + 1);
    const year = value.getFullYear();
    const hours = this.getTwoDigitDateValue(value.getHours());
    const minutes = this.getTwoDigitDateValue(value.getMinutes());
    const seconds = this.getTwoDigitDateValue(value.getSeconds());
    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
  }

  getTwoDigitDateValue(value: number): any {
    return <any>(value > 9 ? value : '0' + value);
  }

  cancel() {
    this.location.back();
  }

  save() {
    let order = <any>this.order;
    order.status = order.status && order.status.value;
    order.contact = this.contactId;
    order = Object.assign(order, this.form.value);
    this.spinner.show();
    this.getSaveQuery(order)
      .finally(() => this.spinner.hide())
      .subscribe(res => this.onSaved(res));
  }

  getSaveQuery(order: any): Observable<any> {
    return this.isNew ?
      this.orderService.add(order) :
      this.orderService.update(this.order.id, order);
  }

  onSaved(res: any) {
    if (res.success) {
      this.order.status = this.orderstatusList.find(i => i.id = res.data.statusId);
      this.order.timeline = res.data.timeline;
      this.form.controls['status'].setValue(res.data.statusId);
      this.isNew = false;
      this.snackBar.open('Дані збережено', null, { duration: 800 });
    } else {
      this.snackBar.open('Помилка при збережені', null, { duration: 800 });
      console.error(res);
    }
    this.form.markAsUntouched();
  }

  getOrderStatus(code: string) {
    if (this.orderstatusList) {
      const orderStatus = this.orderstatusList.find(i => i.code === code);
      return new OrderStatus(orderStatus).value;
    }
    return null;
  }

  setOrderStatus(id: string) {
    this.form.controls['status'].setValue(id);
  }

  onStageChanged(res: any) {
    if (res.success) {
      this.setOrderStatus(res.data.statusId);
    } else {
      this.snackBar.open('Помилка при збережені', null, { duration: 800 });
      console.error(res);
    }
  }

  perform() {
    this.orderService.perform(this.order.id)
      .subscribe(res => {
        this.order.timeline = res.data.timeline;
        this.onStageChanged(res);
        this.form.controls['startDate'].setValue(
          this.getDateString(new Date(Date.parse(res.data.startDate)))
        );
      });
  }

  postpone() {
    this.orderService.postpone(this.order.id)
      .subscribe(res => {
        this.order.timeline = res.data.timeline;
        this.onStageChanged(res);
      });
  }

  continue() {
    this.orderService.continue(this.order.id)
      .subscribe(res => {
        this.order.timeline = res.data.timeline;
        this.onStageChanged(res);
      });
  }

  close() {
    this.orderService.close(this.order.id)
      .subscribe(res => {
        this.order.timeline = res.data.timeline;
        this.onStageChanged(res);
        this.form.controls['endDate'].setValue(
          this.getDateString(new Date(Date.parse(res.data.endDate)))
        );
        this.form.controls['cost'].setValue(res.data.cost);
      });
  }

  reject() {
    this.orderService.reject(this.order.id)
      .subscribe(res => {
        this.order.timeline = res.data.timeline;
        this.onStageChanged(res);
        this.form.controls['endDate'].setValue(
          this.getDateString(new Date(Date.parse(res.data.endDate)))
        );
      });
  }

  getTimelineString(item: any) {
    const startDate = this.parseDate(item && item.startDate);
    const endDate = this.parseDate(item && item.endDate);
    let res = this.getDateString(startDate);
    if (endDate) {
      res += ` - ${this.getDateString(endDate)}`;
    }
    return res;
  }

  parseDate(val: string): Date {
    const d = Date.parse(val);
    return d ? new Date(d) : null;
  }

}
