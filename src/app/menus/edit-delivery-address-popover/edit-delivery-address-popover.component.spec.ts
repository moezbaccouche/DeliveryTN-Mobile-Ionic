import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditDeliveryAddressPopoverComponent } from './edit-delivery-address-popover.component';

describe('EditDeliveryAddressPopoverComponent', () => {
  let component: EditDeliveryAddressPopoverComponent;
  let fixture: ComponentFixture<EditDeliveryAddressPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDeliveryAddressPopoverComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditDeliveryAddressPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
