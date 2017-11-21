import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContactServiceService } from '../../services/contact-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Contact } from '../../models/contact.model';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private contactService: ContactServiceService) { }

  ngOnInit() {
    this.contact = new Contact();
    this.initFormControls();
    this.getRouterParams();
  }

  initFormControls() {
    this.form = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(),
      mobilePhone: new FormControl(),
      email: new FormControl(),
      birthDate: new FormControl()
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
              values[controlName] = this.contact[controlName];
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

}
