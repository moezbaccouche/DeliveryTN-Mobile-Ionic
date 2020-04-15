import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverConfirmEmptyCartComponent } from './popover-confirm-empty-cart.component';

describe('PopoverConfirmEmptyCartComponent', () => {
  let component: PopoverConfirmEmptyCartComponent;
  let fixture: ComponentFixture<PopoverConfirmEmptyCartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverConfirmEmptyCartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverConfirmEmptyCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
