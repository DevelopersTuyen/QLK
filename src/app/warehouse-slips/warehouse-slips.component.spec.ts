import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseSlipsComponent } from './warehouse-slips.component';

describe('WarehouseSlipsComponent', () => {
  let component: WarehouseSlipsComponent;
  let fixture: ComponentFixture<WarehouseSlipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseSlipsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseSlipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
