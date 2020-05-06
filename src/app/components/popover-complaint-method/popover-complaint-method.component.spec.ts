import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverComplaintMethodComponent } from './popover-complaint-method.component';

describe('PopoverComplaintMethodComponent', () => {
  let component: PopoverComplaintMethodComponent;
  let fixture: ComponentFixture<PopoverComplaintMethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverComplaintMethodComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverComplaintMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
