import { LookupsService } from './../../services/lookups.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Tariff } from './../../models/tariff.model';
import { Product } from './../../models/product.model';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Lookup } from '../../models/base.types';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ProductCardComponent implements OnInit {

  lookupName = 'Product';
  tariffList: Tariff[];
  productList: Product[];
  product = new Product();
  isNew = true;
  itemSelected = false;
  form: FormGroup;

  constructor(
    private location: Location,
    private lookupsService: LookupsService) { }

  ngOnInit() {
    this.initFormControls();
    this.getLookupData();
    this.initLookups();
  }

  initLookups() {
    const lookups = ['Tariff'];
    lookups.forEach(lookupNae => {
      this.lookupsService.getLookupData(lookupNae)
        .subscribe(res => {
          if (res.success) {
            const listName = lookupNae.toLowerCase() + 'List';
            this[listName] = res.data
              .filter(i => !i.parent)
              .map(i => new Lookup(i));
          }
        });
    });
  }

  initFormControls() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      tariff: new FormControl(null, Validators.required)
    });
  }

  cancel() {
    this.location.back();
  }

  onError(error) {
    console.error(error);
  }

  getLookupData() {
    this.lookupsService.getLookupData(this.lookupName).subscribe((res: any) => {
      if (res.success) {
        this.productList = res.data.map(p => new Product(p));
        this.isNew = true;
        this.product = new Product();
      } else {
        this.onError(res.error);
      }
    });
  }

  selectProduct(item: Product) {
    this.product = item;
    const values = {
      name: this.product.displayValue || ''
    };
    for (const controlName in this.product) {
      if (this.form.contains(controlName)) {
        const value = this.product[controlName];
        values[controlName] = value && value.value ? value.value : value || null;
      }
    }
    this.form.setValue(values);
    this.isNew = false;
    this.itemSelected = true;
  }

  getListItemClass(item: Product) {
    const productId = this.product && this.product.value;
    const itemId = item && item.value;
    if (productId && productId === itemId) {
      return 'selected';
    }
  }

  getSaveQuery(data: any) {
    return this.isNew ?
      this.lookupsService.addLookupItem(this.lookupName, data) :
      this.lookupsService.setLookupItem(this.lookupName, this.product.value, data);
  }

  save() {
    const data = this.form.value;
    this.getSaveQuery(data)
      .subscribe((res) => {
        if (res.success) {
          alert('Дані збережено');
          this.onSaved(res.data);
        } else {
          alert('Помилка збереження даних');
          this.onError(res);
        }
      }, this.onError);
  }

  onSaved(data: any) {
    const product = new Product(data);
    if (this.isNew) {
      this.productList.unshift(product);
      this.selectProduct(product);
    }
    this.product = product;
  }

  create() {
    this.product = new Product();
    this.selectProduct(this.product);
    this.isNew = true;
  }

  delete() {
    if (confirm('Ви дійсно бажаете видалити запис?')) {
      this.lookupsService.deleteLookupItem(this.lookupName, this.product.value)
        .subscribe((res) => {
          if (res.success) {
            this.product = new Product();
            this.selectProduct(this.product);
            this.getLookupData();
          } else {
            this.onError(res);
          }
        }, this.onError);
    }
  }

}
