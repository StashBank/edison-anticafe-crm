import { Observable } from 'rxjs/Observable';
import { LookupsService } from './../../services/lookups.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContactServiceService } from '../../services/contact-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Contact } from '../../models/contact.model';
import { Promise, resolve } from 'q';

@Component({
  selector: 'app-contact-card',
  templateUrl: './contact-card.component.html',
  styleUrls: ['./contact-card.component.css']
})
export class ContactCardComponent implements OnInit {

  form: FormGroup;
  contact: Contact;
  id: string;
  isNew: boolean;
  ageList: any[];
  productList: any[];
  targetList: any[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private contactService: ContactServiceService,
    private lookupsService: LookupsService) { }

  ngOnInit() {
    this.contact = new Contact();
    this.initFormControls();
    this.initLookups();
    this.getRouterParams();
  }

  initFormControls() {
    this.form = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(),
      mobilePhone: new FormControl(),
      email: new FormControl(),
      birthDate: new FormControl(),
      notes: new FormControl(),
      age: new FormControl(),
      product: new FormControl(),
      target: new FormControl()
    });
  }

  getRouterParams() {
    this.route.params.subscribe((params: any) => {
      this.id = params['id'];
      if (this.id) {
        this.getContact();
      } else {
        this.isNew = true;
      }
    });
  }

  getContact() {
    this.contactService.getContact(this.id)
      .subscribe(response => {
        if (response.success) {
          this.contact = new Contact(response.data);
          const values = {};
          for (const controlName in this.contact) {
            if (this.form.contains(controlName)) {
              const value = this.contact[controlName];
              values[controlName] = value && value.value ? value.value : value || null;
            }
          }
          this.form.setValue(values);
        }
      });
  }

  save() {
    if (this.form.valid) {
      const newContact = Object.assign(this.contact, this.form.value);
      this.contactService.setContact(this.id, newContact)
        .subscribe(res => {
          let msg = 'Дані збережено';
          if (!res.success) {
            msg = res.error;
          }
          alert(msg);
        });
    }
  }

  cancel() {
    this.location.back();
  }

  initLookups() {
    const lookups = ['Age', 'Product', 'Target'];
    lookups.forEach(lookupNae => {
      this.lookupsService.getLookupData(lookupNae)
        .subscribe(res => {
          if (res.success) {
            const listName = lookupNae.toLowerCase() + 'List';
            this[listName] = res.data.map(i => ({ value: i._id, displayValue: i.name }));
          }
        });
    });
  }

}
