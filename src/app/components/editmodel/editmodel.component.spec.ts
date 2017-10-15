import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditmodelComponent } from './editmodel.component';

describe('EditmodelComponent', () => {
  let component: EditmodelComponent;
  let fixture: ComponentFixture<EditmodelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditmodelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
