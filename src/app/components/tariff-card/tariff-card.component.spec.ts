import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TariffCardComponent } from './tariff-card.component';

describe('TariffCardComponent', () => {
  let component: TariffCardComponent;
  let fixture: ComponentFixture<TariffCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TariffCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TariffCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
