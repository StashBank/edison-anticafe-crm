import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactCardDialogComponent } from './contact-card-dialog.component';

describe('ContactCardDialogComponent', () => {
  let component: ContactCardDialogComponent;
  let fixture: ComponentFixture<ContactCardDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactCardDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactCardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
