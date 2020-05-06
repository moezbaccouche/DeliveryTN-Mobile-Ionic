import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConfirmUpdateEmailComponent } from './confirm-update-email.component';

describe('ConfirmUpdateEmailComponent', () => {
  let component: ConfirmUpdateEmailComponent;
  let fixture: ComponentFixture<ConfirmUpdateEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmUpdateEmailComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmUpdateEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
