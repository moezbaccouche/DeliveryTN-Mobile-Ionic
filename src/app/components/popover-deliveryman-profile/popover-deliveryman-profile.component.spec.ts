import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverDeliverymanProfileComponent } from './popover-deliveryman-profile.component';

describe('PopoverDeliverymanProfileComponent', () => {
  let component: PopoverDeliverymanProfileComponent;
  let fixture: ComponentFixture<PopoverDeliverymanProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverDeliverymanProfileComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverDeliverymanProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
