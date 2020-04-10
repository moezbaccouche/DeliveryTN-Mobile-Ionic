import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProfileImageModalPage } from './profile-image-modal.page';

describe('ProfileImageModalPage', () => {
  let component: ProfileImageModalPage;
  let fixture: ComponentFixture<ProfileImageModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileImageModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileImageModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
