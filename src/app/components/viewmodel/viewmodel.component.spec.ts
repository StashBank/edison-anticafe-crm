import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewmodelComponent } from './viewmodel.component';

describe('ViewmodelComponent', () => {
  let component: ViewmodelComponent;
  let fixture: ComponentFixture<ViewmodelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewmodelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
