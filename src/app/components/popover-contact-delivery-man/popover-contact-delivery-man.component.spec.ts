import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverContactDeliveryManComponent } from './popover-contact-delivery-man.component';

describe('PopoverContactDeliveryManComponent', () => {
  let component: PopoverContactDeliveryManComponent;
  let fixture: ComponentFixture<PopoverContactDeliveryManComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverContactDeliveryManComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverContactDeliveryManComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
