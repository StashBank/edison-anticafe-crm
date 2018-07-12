import { Tariff, TariffType, TariffTypeCodes } from './../../models/tariff.model';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Product } from './../../models/product.model';
import { Observable } from 'rxjs';
import { merge } from 'rxjs/observable/merge';
import { OrderService } from './../../services/order.service';
import { ContactServiceService } from './../../services/contact-service.service';
import { Order, OrderStatus, OrderProduct } from './../../models/order.model';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn, AbstractControl, FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { LookupsService } from './../../services/lookups.service';
import { Lookup } from '../../models/base.types';
import { Contact } from '../../models/contact.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddProductDialogComponent } from '../add-product-dialog/add-product-dialog.component';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/filter';

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
  productList: Array<Product> = [];
  orderstatusList: Array<OrderStatus> = [];
  tariffList: Array<Tariff> = [];
  tarifftypeList: Array<TariffType> = [];
  isNew = true;
  lookupTypes = {
    'Product': Product,
    'OrderStatus': OrderStatus,
    'Tariff': Tariff,
    'TariffType': TariffType,
  };

  // #region Properties
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
    if (!this.isNew && this.orderstatusList && this.isHourly) {
      return this.currentStatus && this.currentStatus === this.orderStatusInProgress;
    }
    return false;
  }

  get continueButtonVisible(): boolean {
    if (!this.isNew && this.orderstatusList && this.isHourly) {
      return this.currentStatus && this.currentStatus === this.orderStatusPostponed;
    }
    return false;
  }

  get closeButtonVisible(): boolean {
    if (!this.isNew && this.orderstatusList) {
      if (this.isHourly) {
        return this.currentStatus && this.currentStatus !== this.orderStatusNew;
      }
      return this.currentStatus && this.currentStatus === this.orderStatusInProgress;
    }
    return false;
  }

  get rejectButtonVisible(): boolean {
    if (!this.isNew && this.orderstatusList) {
      return this.currentStatus && this.currentStatus !== this.orderStatusNew;
    }
    return false;
  }

  get closeButtonDisabled(): boolean {
    if (this.isManualCost) {
      return this.form && this.form.invalid;
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
    return this.form.touched && this.form.valid && !this.isFinalStatus;
  }

  get timelines(): any[] {
    return this.order && this.order.timeline && this.order.timeline.timelines || [];
  }

  get products(): OrderProduct[] {
    return this.order && this.order.products;
  }

  get orderProduct(): Product {
    const order = this.order;
    let productId = this.form && this.form.get('product').value;
    productId = productId || order && order.product && (order.product.value || order.product);
    const product = this.productList.find(p => p.value === productId);
    return product;
  }

  get orderProductTariff(): Tariff {
    const product = this.orderProduct;
    const tariffId = product && product.tariff && product.tariff.value;
    const tariff = this.tariffList.find(t => t.value === tariffId);
    return tariff;
  }

  get orderProductTariffType(): TariffType {
    const tariff = this.orderProductTariff
    const typeId = tariff && tariff.type && tariff.type.value;
    const tariffType = this.tarifftypeList.find(t => t.value === typeId);
    return tariffType;
  }

  get orderTariffTypeCode(): string {
    const tariffType = this.orderProductTariffType;
    return tariffType && tariffType.code || '';
  }

  get isManualCost(): boolean {
    return this.orderTariffTypeCode === TariffTypeCodes.Manually;
  }

  get isHourly(): boolean {
    return this.orderTariffTypeCode === TariffTypeCodes.Hour;
  }
  // #endregion

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private contactService: ContactServiceService,
    private orderService: OrderService,
    private lookupsService: LookupsService,
    public snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog) { }

  // #region Methods
  ngOnInit() {
    this.spinner.show();
    this.order = new Order();
    this.initFormControls();
    this.initLookups();
    this.getRouterParams();
  }

  initFormControls() {
    this.form = this.fb.group({
      contactName: null,
      contact: [{value: '', disabled: true}],
      number: [{ value: '', disabled: true }],
      status: [{ value: null, disabled: true }],
      startDate: [{ value: this.getDateString(new Date()), disabled: true }],
      endDate: [{ value: null, disabled: true }],
      cost: [{ value: null, disabled: true }, [this.getCostValidator()]],
      product: [null, Validators.required],
      notes: null,
      products: null
    });
    this.subscribes();
  }
  
  subscribes() {
    merge(
      this.form.get('product').valueChanges,
      this.form.get('status').valueChanges
    )
      .filter(value => !this.getIsFinalStatus(value) && !this.isFinalStatus)
      .subscribe(status => this.setCostControlEnabled());
    this.form.get('status').valueChanges
      .filter(status => !this.getIsFinalStatus(status))
      .subscribe(status => this.setProductControlEnabled());
    this.form.get('status').valueChanges
      .filter(status => !this.getIsFinalStatus(status))
      .subscribe(status => this.setProductControlEnabled());
    this.form.get('status').valueChanges
      .filter(status => this.getIsFinalStatus(status))
      .subscribe(status => this.lockAllControls());
  }

  getIsFinalStatus(statusId): boolean {
    if (this.orderstatusList) {
      const status = this.orderstatusList.find(i => i.value === statusId);
      return status && status.isFinal;
    }
    return false;
  }

  setCostControlEnabled() {
    if (this.isManualCost) {
      this.form.get('cost').enable();
    } else {
      this.form.get('cost').disable();
    }
  }

  setProductControlEnabled() {
    if (this.isNew || this.order.status === this.orderStatusNew) {
      this.form.get('product').enable();
    } else {
      this.form.get('product').disable();
    }
  }

  lockAllControls() {
    this.form.disable({
      emitEvent: false
    });
  }

  getCostValidator(): ValidatorFn {
    return (control: AbstractControl): Validators => {
      if (this.isNew || this.currentStatus === this.orderStatusNew || !this.isManualCost) {
        return null;
      }
      return control.value > 0 ? null : { required: true };
    }
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
    const lookups = ['Product', 'OrderStatus', 'Tariff', 'TariffType'];
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
          this.isNew = false;
          this.setOrderControlValues();
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
          this.isNew = false;
          this.setOrderControlValues();
        }
      });
  }

  setOrderControlValues() {
    for (const columnName of Object.keys(this.order)) {
      const control = this.form.controls[columnName];
      const value = this.order[columnName];
      if (control) {
        control.setValue(this.getControlValue(columnName, value));
      }
    }
    this.setProductControlEnabled();
  }

  getControlValue(controlName: string, value: any) {
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
  // #endregion

  // #region Action
  cancel() {
    this.location.back();
  }

  save() {
    let order = <any>this.order;
    order.status = this.currentStatus || order.status && order.status.value;
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
      this.order.status = this.orderstatusList.find((i: any) => i.value === res.data.statusId || i.id === res.data.statusId);
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
    const status = this.orderstatusList.find(s => s.value === id);
    this.order.status = status;
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
    let manualCost = null;
    if (this.isManualCost) {
      manualCost = this.form.value.cost || prompt('Введіть суму розрахунку');
    }
    this.orderService.close(this.order.id, manualCost)
      .subscribe(res => {
        this.order.timeline = res.data.timeline;
        this.onStageChanged(res);
        this.form.controls['endDate'].setValue(
          this.getDateString(new Date(Date.parse(res.data.endDate)))
        );
        this.form.controls['cost'].setValue(res.data.cost);
        alert(`До сплати ${res.data.cost} грн.`)
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
  // #endregion

  getTimelineString(item: any) {
    const startDate = this.parseDate(item && item.startDate);
    const endDate = this.parseDate(item && item.endDate);
    let res = this.getDateString(startDate);
    if (endDate) {
      const interval = this.getFormatedInterval(this.getDateInterval(startDate, endDate)) || '0';
      res += ` - ${this.getDateString(endDate)} (${interval})`;
    }
    return res;
  }

  getDateInterval(startDate: Date, endDate: Date): any {
    const intervalDate = new Date(<any>endDate - <any>startDate);
    const nullDate = new Date(0);
    return {
      years: intervalDate.getFullYear() - nullDate.getFullYear(),
      months: intervalDate.getMonth() - nullDate.getMonth(),
      days: intervalDate.getDate() - nullDate.getDate(),
      hours: intervalDate.getHours() - nullDate.getHours(),
      minutes: intervalDate.getMinutes() - nullDate.getMinutes(),
      seconds: intervalDate.getSeconds() - nullDate.getSeconds()
    };
  }

  getFormatedInterval(interval: any) {
    let res = '';
    if (interval.years || interval.months || interval.days) {
      const months = this.getTwoDigitDateValue(interval.months);
      const days = this.getTwoDigitDateValue(interval.days);
      res = `${interval.years}.${months}.${days}`;
    }
    if (interval.hours || interval.minutes || interval.seconds) {
      const hours = this.getTwoDigitDateValue(interval.hours);
      const minutes = this.getTwoDigitDateValue(interval.minutes);
      const seconds = this.getTwoDigitDateValue(interval.seconds);
      res += `${hours}:${minutes}:${seconds}`;
    }
    return res.trim();
  }

  parseDate(val: string): Date {
    const d = Date.parse(val);
    return d ? new Date(d) : null;
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === '13' && this.saveButtonEnabled) {
      this.save();
      event.preventDefault();
    }
  }

  addProduct() {
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '640px',
      data: { productList: this.productList }
    });
    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.order.addProduct({
            product: result.productList.find(p => p.value === result.productId),
            quantity: result.quantity
          });
          this.form.patchValue({ products: this.products });
          this.form.markAsTouched();
          this.form.markAsDirty();
          this.save();
        }
      });
  }

  removeProduct(index: number) {
    this.order.removeProduct(index);
    this.form.patchValue({ products: this.products });
    this.form.markAsTouched();
    this.form.markAsDirty();
  }

}
